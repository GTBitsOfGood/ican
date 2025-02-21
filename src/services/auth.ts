import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import {
  passwordsAreEqual,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/auth";
import bcrypt from "bcrypt";
import {
  createUser,
  getUserFromEmail,
  getUserFromId,
} from "../db/actions/auth";
import { User } from "../db/models";
import settingsService from "./settings";
import { petService } from "./pets";
import { Provider } from "@/types/auth";
import JWTService from "./jwt";
import { ObjectId } from "mongodb";

export interface CreateUserBody {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

const authService = {
  // Validate create user input and process account creation
  async validateCreateUser(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    // Validate parameters
    validateName(name);
    validatePassword(password);
    validateEmail(email);
    passwordsAreEqual(password, confirmPassword);

    const existingUser = await getUserFromEmail(email);

    if (existingUser) {
      if (existingUser.provider == Provider.PASSWORD) {
        throw new ConflictError("This user already exists.");
      } else {
        throw new ConflictError("This user is already signed in with Google.");
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: User = {
      name: name,
      provider: Provider.PASSWORD,
      email: email,
      password: hashedPassword,
    };

    // Uses userId returned by insertOne()
    const { insertedId } = await createUser(newUser);
    const userId = insertedId.toString();
    if (!userId) {
      throw new NotFoundError("user does not exist");
    }
    // Used a default name for pet
    await petService.createPet(userId, `${name}'s Pet`, "dog");

    // create settings
    await settingsService.createSettings(insertedId.toString());

    // Create jwt once user is successfully created
    const token = JWTService.generateToken({ userId: insertedId }, 604800);

    return { token };
  },

  // Validate login with email and password
  async validateLogin(email: string, password: string) {
    // Validate parameters
    validateEmail(email);
    validatePassword(password);

    // Check if user exists
    const existingUser = await getUserFromEmail(email);

    if (!existingUser) {
      throw new NotFoundError(
        "Couldn't find your account. Please sign up to create an account.",
      );
    }

    if (existingUser.provider == Provider.GOOGLE) {
      throw new ConflictError("This user is signed in with Google.");
    }

    // Check if password is correct
    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      throw new UnauthorizedError(
        "Wrong password. Try again or click Forgot Password to reset it.",
      );
    }

    // Create and return jwt
    const token = JWTService.generateToken(
      { userId: existingUser._id },
      604800,
    );

    return { token };
  },

  // Validate login with Google
  async validateGoogleLogin(name: string, email: string) {
    validateName(name);
    validateEmail(email);

    // If user doesn't exist add them to database
    let existingUser = await getUserFromEmail(email);

    if (existingUser?.provider == Provider.PASSWORD) {
      throw new ConflictError(
        "This user is already signed in with email and password.",
      );
    }

    if (!existingUser) {
      const newUser: User = {
        name: name,
        provider: Provider.GOOGLE,
        email: email,
        password: "",
      };

      await createUser(newUser);
      existingUser = await getUserFromEmail(email);
      await petService.createPet(
        existingUser?._id?.toString() as string,
        `${name}'s Pet`,
        "dog",
      );
    }

    const token = JWTService.generateToken(
      { userId: existingUser?._id },
      604800,
    );

    return token;
  },

  // Validate JWT token and ensure user exists
  async validateToken(token: string) {
    const decodedToken = JWTService.verifyToken(token);
    await getUserFromId(new ObjectId(decodedToken.userId));

    return decodedToken;
  },
};

export default authService;

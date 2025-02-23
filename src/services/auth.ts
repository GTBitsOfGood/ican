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
import { Provider } from "@/types/auth";
import JWTService from "./jwt";
import { ObjectId } from "mongodb";
import PetService from "./pets";

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

export default class AuthService {
  // Validate create user input and process account creation
  static async validateCreateUser(
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
    await PetService.createPet(userId, `${name}'s Pet`, "dog");

    // create settings
    await settingsService.createSettings(insertedId.toString());

    // Create jwt once user is successfully created
    const token = JWTService.generateToken({ userId: insertedId }, 604800);

    return { token };
  }

  // Validate login with email and password
  static async validateLogin(email: string, password: string) {
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
  }

  // Validate login with Google
  static async validateGoogleLogin(name: string, email: string) {
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
      await PetService.createPet(
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
  }

  // Validate JWT token and ensure user exists
  static async validateToken(token: string) {
    const decodedToken = JWTService.verifyToken(token);
    await getUserFromId(new ObjectId(decodedToken.userId));

    return decodedToken;
  }
}

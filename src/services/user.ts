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
} from "@/utils/user";
import settingsService from "./settings";
import { Provider } from "@/types/user";
import JWTService from "./jwt";
import PetService from "./pets";
import UserDAO from "@/db/actions/user";
import { User } from "@/db/models/user";
import { Types } from "mongoose";

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
  static async register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ): Promise<{ token: string }> {
    // Validate parameters
    validateName(name);
    validatePassword(password);
    validateEmail(email);
    passwordsAreEqual(password, confirmPassword);

    const existingUser = await UserDAO.getUserFromEmail(email);

    if (existingUser) {
      if (existingUser.provider == Provider.PASSWORD) {
        throw new ConflictError("This user already exists.");
      } else {
        throw new ConflictError("This user is already signed in with Google.");
      }
    }

    const newUser: User = {
      name: name,
      provider: Provider.PASSWORD,
      email: email,
      password: password,
    };

    // Uses userId returned by insertOne()
    const { _id } = await UserDAO.createUser(newUser);
    const userId = _id.toString();
    if (!userId) {
      throw new NotFoundError("user does not exist");
    }
    // Used a default name for pet
    await PetService.createPet(userId, `${name}'s Pet`, "dog");

    // create settings
    await settingsService.createSettings(_id.toString());

    // Create jwt once user is successfully created
    const token = JWTService.generateToken({ userId: _id.toString() }, 604800);

    return { token };
  }

  // Validate login with email and password
  static async login(email: string, password: string) {
    // Validate parameters
    validateEmail(email);
    validatePassword(password);

    // Check if user exists
    const existingUser = await UserDAO.getUserFromEmail(email);

    if (!existingUser) {
      throw new NotFoundError(
        "Couldn't find your account. Please sign up to create an account.",
      );
    }

    if (existingUser.provider == Provider.GOOGLE) {
      throw new ConflictError("This user is signed in with Google.");
    }

    // Check if password is correct
    const passwordMatch = await existingUser.comparePassword(password);

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
  static async loginWithGoogle(name: string, email: string) {
    validateName(name);
    validateEmail(email);

    let userId;

    const existingUser = await UserDAO.getUserFromEmail(email);
    if (!existingUser) {
      const newUser: User = {
        name: name,
        provider: Provider.GOOGLE,
        email: email,
      };

      const insertedData = await UserDAO.createUser(newUser);
      userId = insertedData.id;
      await PetService.createPet(userId.toString(), `${name}'s Pet`, "dog");
    } else {
      userId = existingUser._id;
    }

    if (existingUser?.provider === Provider.PASSWORD) {
      throw new ConflictError(
        "This user is already signed in with email and password.",
      );
    }

    const token = JWTService.generateToken({ userId }, 604800);

    return token;
  }

  // Validate JWT token and ensure user exists
  static async validateToken(token: string): Promise<{ userId: string }> {
    const decodedToken = JWTService.verifyToken(token);
    const user = await UserDAO.getUserFromId(
      new Types.ObjectId(decodedToken.userId),
    );
    if (!user) {
      throw new NotFoundError("User does not exist.");
    }
    return decodedToken;
  }
}

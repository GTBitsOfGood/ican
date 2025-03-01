import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import bcrypt from "bcrypt";
import { User } from "../db/models";
import settingsService from "./settings";
import { Provider } from "@/types/user";
import JWTService from "./jwt";
import { ObjectId } from "mongodb";
import PetService from "./pets";
import UserDAO from "@/db/actions/user";
import {
  validateLogin,
  validateLoginWithGoogle,
  validateRegister,
} from "@/utils/serviceUtils/authServiceUtil";

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
  ) {
    // Validate parameters
    validateRegister({
      name,
      email,
      password,
      confirmPassword,
    });

    const existingUser = await UserDAO.getUserFromEmail(email);

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
    const { insertedId } = await UserDAO.createUser(newUser);
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
  static async login(email: string, password: string) {
    // Validate parameters
    validateLogin({
      email,
      password,
    });

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
  static async loginWithGoogle(name: string, email: string) {
    validateLoginWithGoogle({
      name,
      email,
    });

    let userId;

    const existingUser = await UserDAO.getUserFromEmail(email);
    if (!existingUser) {
      const newUser: User = {
        name: name,
        provider: Provider.GOOGLE,
        email: email,
        password: "",
      };

      const { insertedId } = await UserDAO.createUser(newUser);
      userId = insertedId;
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
  static async validateToken(token: string) {
    const decodedToken = JWTService.verifyToken(token);
    await UserDAO.getUserFromId(new ObjectId(decodedToken.userId));

    return decodedToken;
  }
}

import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import settingsService from "./settings";
import { Provider } from "@/types/user";
import JWTService from "./jwt";
import UserDAO from "@/db/actions/user";
import {
  validateLogin,
  validateLoginWithGoogle,
  validateRegister,
  validateTokenInput,
} from "@/utils/serviceUtils/authServiceUtil";
import { User } from "@/db/models/user";
import HashingService from "./hashing";
import ERRORS from "@/utils/errorMessages";
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
  ): Promise<{ token: string; userId: Types.ObjectId }> {
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
        throw new ConflictError(ERRORS.USER.CONFLICT.USER);
      } else {
        throw new ConflictError(ERRORS.USER.CONFLICT.PROVIDER.GOOGLE);
      }
    }

    const newUser: User = {
      name: name,
      provider: Provider.PASSWORD,
      email: email,
      password: await HashingService.hash(password),
    };

    // Uses userId returned by insertOne()
    const { _id } = await UserDAO.createUser(newUser);
    if (!_id) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    // create settings
    await settingsService.createSettings(_id.toString());

    // Create j:wt once user is successfully created
    const token = JWTService.generateToken(
      { userId: _id.toString() },
      10800000,
    );

    return { token, userId: _id };
  }

  static async login(
    email: string,
    password: string,
  ): Promise<{ token: string; userId: string }> {
    // Validate parameters
    validateLogin({
      email,
      password,
    });

    // Check if user exists
    const existingUser = await UserDAO.getUserFromEmail(email);

    if (!existingUser) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    if (existingUser.provider == Provider.GOOGLE) {
      throw new ConflictError(ERRORS.USER.CONFLICT.PROVIDER.GOOGLE);
    }

    // Check if password is correct
    const passwordMatch = await HashingService.compare(
      password,
      existingUser.password as string,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError(ERRORS.USER.UNAUTHORIZED.PASSWORD);
    }

    // Create and return jwt
    const token = JWTService.generateToken(
      { userId: existingUser._id.toString() },
      10800000,
    );

    return { token, userId: existingUser._id.toString() };
  }

  // Validate login with Google
  static async loginWithGoogle(name: string, email: string) {
    validateLoginWithGoogle({
      name,
      email,
    });

    let userId;
    let isNewUser = false;

    const existingUser = await UserDAO.getUserFromEmail(email);
    if (!existingUser) {
      const newUser: User = {
        name: name,
        provider: Provider.GOOGLE,
        email: email,
      };

      const insertedData = await UserDAO.createUser(newUser);
      userId = insertedData._id.toString();
      await settingsService.createSettings(userId);
      isNewUser = true;
    } else {
      userId = existingUser._id.toString();
    }

    if (existingUser?.provider === Provider.PASSWORD) {
      throw new ConflictError(ERRORS.USER.CONFLICT.PROVIDER.PASSWORD);
    }

    const token = JWTService.generateToken({ userId }, 10800000);

    return { token, userId, isNewUser };
  }

  // Validate JWT token and ensure user exists
  static async validateToken(token: string): Promise<{ userId: string }> {
    validateTokenInput({ token });
    const decodedToken = JWTService.verifyToken(token);
    const user = await UserDAO.getUserFromId(decodedToken.userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    return decodedToken;
  }
}

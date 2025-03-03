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
import HashingService from "./hashing";
import ERRORS from "@/utils/errorMessages";

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
  ): Promise<string> {
    // Validate parameters
    validateName(name);
    validatePassword(password);
    validateEmail(email);
    passwordsAreEqual(password, confirmPassword);

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
    // Used a default name for pet
    await PetService.createPet(_id.toString(), `${name}'s Pet`, "dog");

    // create settings
    await settingsService.createSettings(_id.toString());

    // Create jwt once user is successfully created
    const token = JWTService.generateToken({ userId: _id.toString() }, 604800);

    return token;
  }

  // Validate login with email and password
  static async login(email: string, password: string): Promise<string> {
    // Validate parameters
    validateEmail(email);
    validatePassword(password);

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
      existingUser.password as string,
      password,
    );

    if (!passwordMatch) {
      throw new UnauthorizedError(ERRORS.USER.UNAUTHORIZED.PASSWORD);
    }

    // Create and return jwt
    const token = JWTService.generateToken(
      { userId: existingUser._id.toString() },
      604800,
    );

    return token;
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
      userId = insertedData._id.toString();
      await PetService.createPet(userId, `${name}'s Pet`, "dog");
    } else {
      userId = existingUser._id.toString();
    }

    if (existingUser?.provider === Provider.PASSWORD) {
      throw new ConflictError(ERRORS.USER.CONFLICT.PROVIDER.PASSWORD);
    }

    const token = JWTService.generateToken({ userId }, 604800);

    return token;
  }

  // Validate JWT token and ensure user exists
  static async validateToken(token: string): Promise<string> {
    const decodedToken = JWTService.verifyToken(token);
    const user = await UserDAO.getUserFromId(decodedToken.userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    return decodedToken.userId;
  }
}

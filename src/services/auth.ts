import {
  AlreadyExistsError,
  BadRequestError,
  DoesNotExistError,
  InternalServerError,
  UnauthorizedError,
} from "@/types/exceptions";
import {
  passwordsAreEqual,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/auth";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";

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

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
}

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function validateCreateUser(
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

  // Check if user already exists
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new AlreadyExistsError("user already exists");
  }

  // Hash password and create user to pass to access layer
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: User = {
    name: name,
    email: email,
    password: hashedPassword,
  };

  await createUser(newUser);

  // Create jwt once user is successfully created
  const token = jwt.sign(
    {
      userId: newUser._id,
    },
    JWT_SECRET,
    {
      expiresIn: "1w",
    },
  );

  return { token };
}

export async function validateLogin(email: string, password: string) {
  // Validate parameters
  validateEmail(email);
  validatePassword(password);

  // Check if user exists
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new DoesNotExistError("user does not exist");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    throw new BadRequestError("password is not correct");
  }

  // Create and return jwt
  const token = jwt.sign(
    {
      userId: existingUser._id,
    },
    JWT_SECRET,
    {
      expiresIn: "1w",
    },
  );

  return { token };
}

export async function validateJsonWebToken(authorization: string) {
  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError("No token provided");
  }

  const token = authorization.split(" ")[1];

  try {
    const decodedToken = jwt.verify(token, JWT_SECRET);
    return { isValid: true, decodedToken: decodedToken };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid or expired token.");
    } else {
      throw new InternalServerError("An unknown error occurred.");
    }
  }
}

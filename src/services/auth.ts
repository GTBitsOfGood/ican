import {
  AlreadyExistsError,
  BadRequestError,
  DoesNotExistError,
} from "@/types/exceptions";
import {
  passwordsAreEqual,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/auth";
import bcrypt from "bcrypt";
import jwt, { JwtPayload } from "jsonwebtoken";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";
import { decodeGoogleToken } from "./jwt";

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
  const dbNewUser = await findUserByEmail(email);

  // Create jwt once user is successfully created
  const token = jwt.sign(
    {
      userId: dbNewUser?._id,
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

export async function validateGoogleLogin(credential: string) {
  const decodedToken = decodeGoogleToken(credential) as JwtPayload;

  // If user doesn't exist add them to database
  let existingUser = await findUserByEmail(decodedToken.email);

  if (!existingUser) {
    const newUser: User = {
      name: decodedToken.name,
      email: decodedToken.email,
      password: "",
    };

    await createUser(newUser);
    existingUser = await findUserByEmail(decodedToken.email);
  }

  const token = jwt.sign(
    {
      userId: existingUser?._id,
    },
    JWT_SECRET,
    {
      expiresIn: "1w",
    },
  );

  return { token };
}

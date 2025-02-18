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
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";
import { createPet } from "./pets";

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

  // Uses userId returned by insertOne()
  const { insertedId } = await createUser(newUser);
  const userId = insertedId.toString();
  if (!userId) {
    throw new DoesNotExistError("user does not exist");
  }
  // Used a default name for pet
  await createPet(userId, `${name}'s Pet`);

  // Create jwt once user is successfully created
  const token = jwt.sign(
    {
      email: newUser.email,
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
      email: email,
    },
    JWT_SECRET,
    {
      expiresIn: "1w",
    },
  );

  return { token };
}

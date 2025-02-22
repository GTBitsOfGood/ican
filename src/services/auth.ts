import {
  AlreadyExistsError,
  BadRequestError,
  DoesNotExistError,
  InternalServerError,
} from "@/types/exceptions";
import {
  passwordsAreEqual,
  validateEmail,
  validateName,
  validatePassword,
} from "@/utils/auth";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";
import { generateToken, verifyToken } from "./jwt";
import { getUserFromId } from "@/db/actions/user";
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

export async function validateAuthorization(
  authHeader: string | null,
): Promise<boolean> {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }

  const token = authHeader.split(" ")[1];

  try {
    const tokenUserId: string = verifyToken(token).userId;
    const tokenUserObjectId: ObjectId = new ObjectId(tokenUserId);
    const user = await getUserFromId(tokenUserObjectId);

    return !!user;
  } catch {
    return false;
  }
}

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

  const { insertedId } = await createUser(newUser);

  // Create jwt once user is successfully created
  const token = generateToken(insertedId);

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

  // Check if _id field exists (typescript purposes)
  if (!existingUser._id) {
    throw new InternalServerError("User ID is missing");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    throw new BadRequestError("password is not correct");
  }

  // Create and return jwt
  const token = generateToken(existingUser._id);

  return { token };
}

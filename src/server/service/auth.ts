import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";
import { AlreadyExistsError, CustomError } from "@/utils/types/exceptions";
import jwt from "jsonwebtoken";
import { validatePassword } from "@/utils/auth";

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
  if (
    typeof name !== "string" ||
    name.trim() === "" ||
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.trim() === "" ||
    typeof confirmPassword !== "string" ||
    password.trim() === ""
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'name', 'email', 'password', and 'confirmPassword' are required and must be non-empty strings.",
    );
  }

  //Validate password & confirmPassword
  validatePassword(password, confirmPassword);

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
  if (
    typeof email !== "string" ||
    email.trim() === "" ||
    typeof password !== "string" ||
    password.trim() === ""
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'email' and 'password' are required and must be non-empty strings.",
    );
  }

  // Check if user exists
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new CustomError(400, "user does not exist");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    throw new CustomError(400, "password is not correct");
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

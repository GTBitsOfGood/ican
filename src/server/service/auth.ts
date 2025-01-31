import bcrypt from "bcrypt";
import { createUser } from "../db/actions/auth";
import { User } from "../db/models";
import { AlreadyExistsError, CustomError } from "@/utils/types/exceptions";
import client from "../db/dbClient";
import jwt from "jsonwebtoken";

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

export async function validateCreateUser(body: CreateUserBody) {
  // Validate body
  const createBody: CreateUserBody = body;
  if (
    !createBody ||
    typeof createBody.name !== "string" ||
    createBody.name.trim() === "" ||
    typeof createBody.email !== "string" ||
    createBody.email.trim() === "" ||
    typeof createBody.password !== "string" ||
    createBody.name.trim() === "" ||
    typeof createBody.confirmPassword !== "string"
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'name', 'email', 'password', and 'confirmPassword' are required and must be non-empty strings.",
    );
  }

  // Assert a password length of greater than 10
  if (createBody.password.length <= 10) {
    throw new CustomError(400, "Password must be more than 10 characters.");
  }

  // Check password & confirmPassword
  if (body.password != body.confirmPassword) {
    throw new CustomError(400, "password does not equal confirm password");
  }

  // Check if user already exists
  const db = client.db();

  const existingUser = await db
    .collection("users")
    .findOne({ email: body.email });

  if (existingUser) {
    throw new AlreadyExistsError("user already exists");
  }

  // Hash password and create user to pass to access layer
  const hashedPassword = await bcrypt.hash(body.password, 10);

  const newUser: User = {
    name: body.name,
    email: body.email,
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

  return token;
}

export async function validateLogin(body: LoginBody) {
  // Validate body
  const loginBody: LoginBody = body;
  if (
    !loginBody ||
    typeof loginBody.email !== "string" ||
    loginBody.email.trim() === "" ||
    typeof loginBody.password !== "string" ||
    loginBody.password.trim() === ""
  ) {
    throw new CustomError(
      400,
      "Invalid request body: 'email' and 'password' are required and must be non-empty strings.",
    );
  }

  // Check if user exists
  const db = client.db();

  const existingUser = await db
    .collection("users")
    .findOne({ email: body.email });

  if (!existingUser) {
    throw new CustomError(400, "user does not exist");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(
    body.password,
    existingUser.password,
  );

  if (!passwordMatch) {
    throw new CustomError(400, "password is not correct");
  }

  // Create and return jwt
  const token = jwt.sign(
    {
      email: body.email,
    },
    JWT_SECRET,
    {
      expiresIn: "1w",
    },
  );

  return { token };
}

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

import { createSettings } from "./settings";
import { createPet } from "./pets";
import { Provider } from "@/types/auth";
import { createUser, findUserByEmail } from "../db/actions/auth";
import { User } from "../db/models";
import { generateToken } from "./jwt";
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

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in the environment variables.");
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

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    if (existingUser.provider == Provider.PASSWORD) {
      throw new AlreadyExistsError("This user already exists.");
    } else {
      throw new AlreadyExistsError(
        "This user is already signed in with Google.",
      );
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  // generate new random _id
  const _id = new ObjectId();

  const newUser: User = {
    _id,
    name: name,
    provider: Provider.PASSWORD,
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
  await createPet(userId, `${name}'s Pet`, "dog");

  // create settings
  await createSettings({ userId: _id.toString() });

  // Create jwt once user is successfully created
  const token = generateToken(new ObjectId(userId));

  return { token };
}

export async function validateLogin(email: string, password: string) {
  // Validate parameters
  validateEmail(email);
  validatePassword(password);

  // Check if user exists
  const existingUser = await findUserByEmail(email);

  if (!existingUser) {
    throw new DoesNotExistError(
      "Couldn't find your account. Please sign up to create an account.",
    );
  }

  if (existingUser.provider == Provider.GOOGLE) {
    throw new AlreadyExistsError("This user is signed in with Google.");
  }

  // Check if password is correct
  const passwordMatch = await bcrypt.compare(password, existingUser.password);

  if (!passwordMatch) {
    throw new BadRequestError(
      "Wrong password. Try again or click Forgot Password to reset it.",
    );
  }

  const token = generateToken(existingUser._id!);

  return { token };
}

export async function validateGoogleLogin(name: string, email: string) {
  validateName(name);
  validateEmail(email);

  // If user doesn't exist add them to database
  let existingUser = await findUserByEmail(email);

  if (existingUser?.provider == Provider.PASSWORD) {
    throw new AlreadyExistsError(
      "This user is already signed in with email and password.",
    );
  }

  if (!existingUser) {
    const newUser: User = {
      name: name,
      provider: Provider.GOOGLE,
      email: email,
      password: "",
    };

    await createUser(newUser);
    existingUser = await findUserByEmail(email);
    await createPet(
      existingUser?._id?.toString() as string,
      `${name}'s Pet`,
      "dog",
    );
  }

  const token = generateToken(existingUser?._id as ObjectId);

  return token;
}

export async function validateToken() {
  // const decodedToken = verifyToken(token);
  // await getUserFromId(new ObjectId(decodedToken.userId));
  // return decodedToken;
}

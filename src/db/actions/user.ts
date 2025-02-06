import { ObjectId, WithId } from "mongodb";
import client from "../dbClient";
import { User } from "../models";
import {
  InternalError,
  InvalidArgumentsError,
  NotFoundError,
} from "@/types/exceptions";

export async function getUserFromEmail(
  email: string | undefined,
): Promise<WithId<User>> {
  if (!email || !email.trim()) {
    throw new InvalidArgumentsError("Invalid Email.");
  }

  const db = client.db();
  const user = await db.collection<User>("users").findOne({ email });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return user;
}

export async function getUserFromId(_id: ObjectId) {
  const db = client.db();
  const user = await db.collection<User>("users").findOne({ _id });
  if (!user) {
    throw new NotFoundError("User does not exist.");
  }
  return user;
}

export async function updateUserPasswordFromId(
  _id: ObjectId,
  newPassword: string,
) {
  const db = client.db();
  const userExists = await db.collection<User>("users").findOne({ _id });
  if (!userExists) {
    throw new NotFoundError("User does not exist.");
  }
  const result = await db
    .collection<User>("users")
    .updateOne({ _id }, { $set: { password: newPassword } });
  if (result.modifiedCount === 0) {
    throw new InternalError("User password update failed.");
  }
}

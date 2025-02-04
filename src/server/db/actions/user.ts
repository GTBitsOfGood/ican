import { ObjectId, WithId } from "mongodb";
import client from "../dbClient";
import { User } from "../models";
import {
  BadRequestError,
  InternalServerError,
  NotFoundError,
} from "@/utils/errors";

export async function getUserFromEmail(
  email: string | undefined,
): Promise<WithId<User>> {
  if (!email || !email.trim()) {
    throw new BadRequestError("Invalid Email.");
  }
  const user = await getUserFromEmail(email);
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
    throw new InternalServerError("User password update failed.");
  }
}

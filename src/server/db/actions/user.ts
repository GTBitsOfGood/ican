import { ObjectId, WithId } from "mongodb";
import client from "../dbClient";
import { User } from "../models";
import { InternalServerError, NotFoundError } from "@/utils/errors";

export async function getUserFromEmail(
  email: string,
): Promise<WithId<User> | null> {
  const db = client.db();
  const user = await db.collection<User>("users").findOne({ email });
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

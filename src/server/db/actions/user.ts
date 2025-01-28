import { ObjectId, WithId } from "mongodb";
import client from "../dbClient";
import { User } from "../models";
import ApiError from "@/services/apiError";

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
  const result = await db
    .collection("users")
    .updateOne({ _id }, { $set: { password: newPassword } });
  if (result.modifiedCount === 0) {
    throw new ApiError("User password update failed.", 500);
  }
}

import { InternalError } from "@/types/exceptions";
import client from "../dbClient";
import { User } from "../models";

export async function createUser(newUser: User) {
  const db = client.db();
  try {
    await db.collection("users").insertOne(newUser);
  } catch (error) {
    console.error("Failed to insert new user:", error);
    throw new InternalError("Failed to insert new user");
  }
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const db = client.db();
  const existingUser = await db.collection("users").findOne({ email: email });
  return existingUser as User | null;
}

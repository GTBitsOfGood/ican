import { CustomError } from "@/utils/types/exceptions";
import client from "../dbClient";
import { User } from "../models";

export async function createUser(newUser: User) {
  const db = client.db();
  try {
    await db.collection("users").insertOne(newUser);
  } catch (error) {
    console.error("Failed to insert new user:", error);
    throw new CustomError(500, "Internal Server Error");
  }
}

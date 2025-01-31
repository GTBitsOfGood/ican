import client from "../dbClient";
import { User } from "../models";

export async function createUser(newUser: User) {
  const db = client.db();
  await db.collection("users").insertOne(newUser);
}

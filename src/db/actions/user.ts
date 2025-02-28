import { ObjectId, WithId } from "mongodb";
import client from "../dbClient";
import { User } from "../models";
import { InvalidArgumentsError } from "@/types/exceptions";

export default class UserDAO {
  static async createUser(newUser: User) {
    const db = client.db();
    try {
      return await db.collection("users").insertOne(newUser);
    } catch (error) {
      console.error("Failed to insert new user:", error);
      throw new Error();
    }
  }

  static async getUserFromEmail(email?: string): Promise<WithId<User> | null> {
    if (!email || !email.trim()) {
      throw new InvalidArgumentsError("Invalid Email.");
    }

    const db = client.db();
    const user = await db.collection<User>("users").findOne({ email });

    if (!user) {
      return null;
    }
    return user;
  }

  static async getUserFromId(_id: ObjectId): Promise<WithId<User> | null> {
    const db = client.db();
    const user = await db.collection<User>("users").findOne({ _id });
    if (!user) {
      return null;
    }
    return user;
  }

  static async updateUserPasswordFromId(_id: ObjectId, newPassword: string) {
    const db = client.db();
    const result = await db
      .collection<User>("users")
      .updateOne({ _id }, { $set: { password: newPassword } });
    if (result.modifiedCount === 0) {
      throw new Error("User password update failed.");
    }
  }
}

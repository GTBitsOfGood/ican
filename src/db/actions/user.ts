import { InvalidArgumentsError } from "@/types/exceptions";
import UserModel, { User, UserDocument } from "../models/user";
import { HydratedDocument, Schema, Types } from "mongoose";
import dbConnect from "../dbConnect";

export default class UserDAO extends Schema {
  static async createUser(
    newUser: User,
  ): Promise<HydratedDocument<UserDocument>> {
    try {
      await dbConnect();
      return await UserModel.insertOne(newUser);
    } catch (error) {
      console.log(error);
      throw new Error("User creation failed. Please try again.");
    }
  }

  static async getUserFromEmail(
    email?: string,
  ): Promise<HydratedDocument<UserDocument> | null> {
    if (!email || !email.trim()) {
      throw new InvalidArgumentsError("Invalid Email.");
    }
    await dbConnect();
    return await UserModel.findOne({ email });
  }

  static async getUserFromId(
    _id: Types.ObjectId,
  ): Promise<HydratedDocument<UserDocument> | null> {
    await dbConnect();
    return await UserModel.findById(_id);
  }

  static async updateUserPasswordFromId(
    _id: Types.ObjectId,
    newPassword: string,
  ): Promise<void> {
    await dbConnect();
    const result = await UserModel.updateOne(
      { _id },
      { password: newPassword },
    );
    if (result.modifiedCount === 0) {
      throw new Error("User password update failed.");
    }
  }
}

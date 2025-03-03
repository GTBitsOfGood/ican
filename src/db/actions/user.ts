import { InvalidArgumentsError } from "@/types/exceptions";
import UserModel, { User, UserDocument } from "../models/user";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../dbConnect";

export default class UserDAO {
  static async createUser(
    newUser: User,
  ): Promise<HydratedDocument<UserDocument>> {
    await dbConnect();
    return await UserModel.insertOne(newUser);
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
    id: string | Types.ObjectId,
  ): Promise<HydratedDocument<UserDocument> | null> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    return await UserModel.findById(_id);
  }

  static async updateUserPasswordFromId(
    id: string | Types.ObjectId,
    newPassword: string,
  ): Promise<void> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const result = await UserModel.updateOne(
      { _id: _id },
      { password: newPassword },
    );
    if (result.modifiedCount === 0) {
      throw new Error("User password update failed.");
    }
  }
}

import { InvalidArgumentsError } from "@/types/exceptions";
import UserModel, { User, UserDocument } from "../models/user";
import { HydratedDocument, Types } from "mongoose";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

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
      throw new InvalidArgumentsError(ERRORS.USER.INVALID_ARGUMENTS.EMAIL);
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
      throw new Error(ERRORS.USER.FAILURE.PASSWORD_UPDATE);
    }
  }

  static async deleteUserFromId(id: string | Types.ObjectId) {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);

    await dbConnect();

    const result = await UserModel.findByIdAndDelete(_id);

    if (result.modifiedCount === 0) {
      throw new Error(ERRORS.USER.FAILURE.DELETE_USER);
    }
  }

  static async updateOnboardingStatus(
    id: string | Types.ObjectId,
    isOnboarded: boolean,
  ): Promise<void> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const result = await UserModel.updateOne(
      { _id: _id },
      { isOnboarded: isOnboarded },
    );
    if (result.modifiedCount === 0) {
      throw new Error("Failed to update onboarding status");
    }
  }

  static async getOnboardingStatus(
    id: string | Types.ObjectId,
  ): Promise<boolean> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const user = await UserModel.findById(_id).select("isOnboarded");
    if (!user) {
      throw new Error(ERRORS.USER.NOT_FOUND);
    }
    return user.isOnboarded ?? false;
  }
}

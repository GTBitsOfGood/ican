import { HydratedDocument, Types } from "mongoose";
import ForgotPasswordCodeModel, {
  ForgotPasswordCodeDocument,
  ForgotPasswordCode,
} from "../models/forgotPasswordCode";
import dbConnect from "../dbConnect";

export default class ForgotPasswordCodeDAO {
  static async createForgotPasswordCode(
    newCode: ForgotPasswordCode,
  ): Promise<HydratedDocument<ForgotPasswordCodeDocument>> {
    await dbConnect();
    return await ForgotPasswordCodeModel.insertOne(newCode);
  }

  static async updateForgotPasswordCodeByUserId(
    userId: Types.ObjectId,
    updatedCode: ForgotPasswordCode,
  ): Promise<void> {
    await dbConnect();
    const result = await ForgotPasswordCodeModel.updateOne(
      { userId },
      {
        code: updatedCode.code,
        expirationDate: updatedCode.expirationDate,
      },
    );
    if (result.modifiedCount === 0) {
      throw new Error("Failed to update forgot password code.");
    }
  }

  static async getForgotPasswordCodeByUserId(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<ForgotPasswordCodeDocument> | null> {
    await dbConnect();
    return ForgotPasswordCodeModel.findOne({ userId });
  }

  static async deleteForgotPasswordCodeById(
    _id: Types.ObjectId,
  ): Promise<boolean> {
    await dbConnect();
    const result = await ForgotPasswordCodeModel.deleteOne({ _id });
    return result.deletedCount > 0;
  }
}

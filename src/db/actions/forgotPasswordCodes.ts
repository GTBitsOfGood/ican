import { HydratedDocument, Types } from "mongoose";
import ForgotPasswordCodeModel, {
  ForgotPasswordCodeDocument,
  ForgotPasswordCode,
} from "../models/forgotPasswordCode";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

export default class ForgotPasswordCodeDAO {
  static async createForgotPasswordCode(
    newCode: ForgotPasswordCode,
  ): Promise<HydratedDocument<ForgotPasswordCodeDocument>> {
    await dbConnect();
    return await ForgotPasswordCodeModel.insertOne(newCode);
  }

  static async updateForgotPasswordCodeByUserId(
    _userId: string | Types.ObjectId,
    updatedCode: ForgotPasswordCode,
  ): Promise<void> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    const result = await ForgotPasswordCodeModel.updateOne(
      { userId },
      {
        code: updatedCode.code,
        expirationDate: updatedCode.expirationDate,
      },
    );
    if (result.modifiedCount === 0) {
      throw new Error(ERRORS.FORGOTPASSWORDCODE.FAILURE.UPDATE);
    }
  }

  static async getForgotPasswordCodeByUserId(
    _userId: string | Types.ObjectId,
  ): Promise<HydratedDocument<ForgotPasswordCodeDocument> | null> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    return ForgotPasswordCodeModel.findOne({ userId });
  }

  static async deleteForgotPasswordCodeById(
    id: string | Types.ObjectId,
  ): Promise<void> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const result = await ForgotPasswordCodeModel.deleteOne({ _id });
    if (result.deletedCount == 0) {
      throw new Error(ERRORS.FORGOTPASSWORDCODE.FAILURE.DELETE);
    }
  }
}

import { ObjectId } from "mongodb";
import client from "../dbClient";
import { ForgotPasswordCode } from "../models";

export default class ForgotPasswordCodeDAO {
  static async createForgotPasswordCode(newCode: ForgotPasswordCode) {
    const db = client.db();
    await db
      .collection<ForgotPasswordCode>("forgotPasswordCodes")
      .insertOne(newCode);
  }

  static async updateForgotPasswordCodeByUserId(
    userId: ObjectId,
    updatedCode: ForgotPasswordCode,
  ) {
    const db = client.db();
    const result = await db
      .collection<ForgotPasswordCode>("forgotPasswordCodes")
      .updateOne(
        { userId },
        {
          $set: {
            code: updatedCode.code,
            expirationDate: updatedCode.expirationDate,
          },
        },
      );
    if (result.modifiedCount === 0) {
      throw new Error("Failed to update forgot password code.");
    }
  }

  static async getForgotPasswordCodeByUserId(
    userId: ObjectId,
  ): Promise<ForgotPasswordCode | null> {
    const db = client.db();
    const code = await db
      .collection<ForgotPasswordCode>("forgotPasswordCodes")
      .findOne({ userId });
    return code;
  }

  static async deleteForgotPasswordCodeById(
    _id: ObjectId | undefined,
  ): Promise<boolean> {
    const db = client.db();
    const result = await db
      .collection<ForgotPasswordCode>("forgotPasswordCodes")
      .deleteOne({ _id });
    return result.deletedCount > 0;
  }
}

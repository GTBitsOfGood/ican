import { ObjectId } from "mongodb";
import client from "../dbClient";
import { ForgotPasswordCode } from "../models";
import { InternalServerError } from "@/types/exceptions";

export async function createForgotPasswordCode(newCode: ForgotPasswordCode) {
  const db = client.db();
  await db
    .collection<ForgotPasswordCode>("forgotPasswordCodes")
    .insertOne(newCode);
}

export async function updateForgotPasswordCodeByUserId(
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
    throw new InternalServerError("Failed to update forgot password code.");
  }
}

export async function getForgotPasswordCodeByUserId(
  userId: ObjectId,
): Promise<ForgotPasswordCode | null> {
  const db = client.db();
  const code = await db
    .collection<ForgotPasswordCode>("forgotPasswordCodes")
    .findOne({ userId });
  return code;
}

export async function deleteForgotPasswordCodeById(
  _id: ObjectId | undefined,
): Promise<boolean> {
  const db = client.db();
  const result = await db
    .collection<ForgotPasswordCode>("forgotPasswordCodes")
    .deleteOne({ _id });
  return result.deletedCount > 0;
}

import { ObjectId } from "mongodb";
import {
  createForgotPasswordCode,
  deleteForgotPasswordCodeById,
  getForgotPasswordCodeByUserId,
  updateForgotPasswordCodeByUserId,
} from "../db/actions/forgotPasswordCodes";
import bcrypt from "bcrypt";
import { ForgotPasswordCode } from "../db/models";
import {
  getUserFromEmail,
  getUserFromId,
  updateUserPasswordFromId,
} from "../db/actions/auth";
import { AppError, InvalidArgumentsError } from "@/types/exceptions";
import {
  generateEncryptedCode,
  generateExpirationDate,
  get4DigitCode,
} from "@/utils/forgotPasswordUtils";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import JWTService from "./jwt";

export default class ForgotPasswordService {
  static async sendPasswordCode(email: string | undefined): Promise<ObjectId> {
    try {
      const user = await getUserFromEmail(email);
      const code = get4DigitCode();
      const expirationDate = generateExpirationDate();

      const newCode: ForgotPasswordCode = {
        code: await generateEncryptedCode(code),
        expirationDate,
        userId: user._id,
      };

      const previousCode = await getForgotPasswordCodeByUserId(user._id);

      if (previousCode) {
        await updateForgotPasswordCodeByUserId(user._id, newCode);
      } else {
        await createForgotPasswordCode(newCode);
      }
      return user._id;
    } catch (error) {
      if (!(error instanceof AppError)) {
        throw new Error("An unknown error occurred.");
      }
      throw error;
    }
  }

  static async verifyForgotPasswordCode(
    userIdString: string,
    code: string,
  ): Promise<string> {
    if (!userIdString?.trim())
      throw new InvalidArgumentsError("User ID is required.");
    if (!code?.trim()) throw new InvalidArgumentsError("Code is required.");

    const userId = new ObjectId(userIdString);
    try {
      const user = await getUserFromId(userId);
      const forgotPasswordCode = await getForgotPasswordCodeByUserId(user._id);
      if (!forgotPasswordCode)
        throw new NotFoundError(
          "No forgot password code found for this user ID.",
        );

      if (new Date() > forgotPasswordCode.expirationDate)
        throw new ConflictError("Forgot password code has expired.");

      const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
      if (!isMatch)
        throw new UnauthorizedError("Invalid forgot password code.");

      await deleteForgotPasswordCodeById(forgotPasswordCode._id);
      return JWTService.generateToken({ userId }, 900);
    } catch (error) {
      if (!(error instanceof AppError)) {
        throw new Error("An unknown error occurred.");
      }
      throw error;
    }
  }

  static async changePassword(
    token: string,
    newPassword: string,
    confirmPassword: string,
  ) {
    if (!newPassword?.trim())
      throw new InvalidArgumentsError("New password is required.");
    if (!confirmPassword?.trim())
      throw new InvalidArgumentsError("Confirm password is required.");

    if (newPassword !== confirmPassword)
      throw new UnauthorizedError("Passwords do not match.");
    try {
      const decoded = JWTService.verifyToken(token);
      const userId = new ObjectId(decoded.userId);
      const user = await getUserFromId(userId);

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await updateUserPasswordFromId(user._id, hashedPassword);
    } catch (error) {
      if (!(error instanceof AppError)) {
        throw new Error("An unknown error occurred.");
      }
      throw error;
    }
  }
}

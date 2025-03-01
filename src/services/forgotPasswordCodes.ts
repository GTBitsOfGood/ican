import bcrypt from "bcrypt";
import { InvalidArgumentsError } from "@/types/exceptions";
import {
  generateExpirationDate,
  get4DigitCode,
} from "@/utils/forgotPasswordUtils";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import JWTService from "./jwt";
import UserDAO from "@/db/actions/user";
import ForgotPasswordCodeDAO from "@/db/actions/forgotPasswordCodes";
import EmailService from "./mail";
import { Types } from "mongoose";
import { ForgotPasswordCode } from "@/db/models/forgotPasswordCode";

export default class ForgotPasswordService {
  static async sendPasswordCode(
    email: string | undefined,
  ): Promise<Types.ObjectId> {
    // TODO EMAIL
    const user = await UserDAO.getUserFromEmail(email);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }
    const code = get4DigitCode();
    const expirationDate = generateExpirationDate();

    const newCode: ForgotPasswordCode = {
      code,
      expirationDate,
      userId: user._id,
    };

    const previousCode =
      await ForgotPasswordCodeDAO.getForgotPasswordCodeByUserId(user._id);

    if (previousCode) {
      await ForgotPasswordCodeDAO.updateForgotPasswordCodeByUserId(
        user._id,
        newCode,
      );
    } else {
      await ForgotPasswordCodeDAO.createForgotPasswordCode(newCode);
    }

    const emailSubject = "iCAN Account Recovery";

    const emailHtml = `<h2> Someone is trying to reset your iCAN account.</h2>
    <p>Your verification code is: ${code}</p>
    <p>If you did not request this, you can ignore this email</p>`;

    try {
      await EmailService.sendEmail(email!, emailSubject, emailHtml);
    } catch {
      throw new Error("Email failed to send.");
    }

    return user._id;
  }

  static async verifyForgotPasswordCode(
    userIdString: string,
    code: string,
  ): Promise<string> {
    if (!userIdString?.trim())
      throw new InvalidArgumentsError("User ID is required.");
    if (!code?.trim()) throw new InvalidArgumentsError("Code is required.");

    const userId = new Types.ObjectId(userIdString);
    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const forgotPasswordCode =
      await ForgotPasswordCodeDAO.getForgotPasswordCodeByUserId(user._id);
    if (!forgotPasswordCode)
      throw new NotFoundError(
        "No forgot password code found for this user ID.",
      );

    if (new Date() > forgotPasswordCode.expirationDate)
      throw new ConflictError("Forgot password code has expired.");

    const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
    if (!isMatch) throw new UnauthorizedError("Invalid forgot password code.");

    await ForgotPasswordCodeDAO.deleteForgotPasswordCodeById(
      forgotPasswordCode._id,
    );
    return JWTService.generateToken({ userId }, 900);
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

    const decoded = JWTService.verifyToken(token);
    const userId = new Types.ObjectId(decoded.userId);
    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError("User does not exist");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await UserDAO.updateUserPasswordFromId(user._id, hashedPassword);
  }
}

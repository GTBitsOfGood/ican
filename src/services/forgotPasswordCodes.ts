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
import HashingService from "./hashing";
import ERRORS from "@/utils/errorMessages";

export default class ForgotPasswordService {
  static async sendPasswordCode(
    email: string | undefined,
  ): Promise<Types.ObjectId> {
    // TODO EMAIL
    const user = await UserDAO.getUserFromEmail(email);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    const code = get4DigitCode();
    const expirationDate = generateExpirationDate();
    const encryptedCode = await HashingService.hash(code);

    const newCode: ForgotPasswordCode = {
      code: encryptedCode,
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
      throw new Error(ERRORS.MAIL.FAILURE);
    }

    return user._id;
  }

  static async verifyForgotPasswordCode(
    userId: string,
    code: string,
  ): Promise<string> {
    if (!userId?.trim())
      throw new InvalidArgumentsError(
        ERRORS.FORGOTPASSWORDCODE.INVALID_ARGUMENTS.USER_ID,
      );
    if (!code?.trim())
      throw new InvalidArgumentsError(
        ERRORS.FORGOTPASSWORDCODE.INVALID_ARGUMENTS.CODE,
      );

    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const forgotPasswordCode =
      await ForgotPasswordCodeDAO.getForgotPasswordCodeByUserId(user._id);
    if (!forgotPasswordCode)
      throw new NotFoundError(ERRORS.FORGOTPASSWORDCODE.NOT_FOUND);

    if (new Date() > forgotPasswordCode.expirationDate)
      throw new ConflictError(ERRORS.FORGOTPASSWORDCODE.CONFLICT);

    const isMatch = await HashingService.compare(code, forgotPasswordCode.code);
    if (!isMatch)
      throw new UnauthorizedError(ERRORS.FORGOTPASSWORDCODE.UNAUTHORIZED.CODE);

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
      throw new InvalidArgumentsError(
        ERRORS.FORGOTPASSWORDCODE.INVALID_ARGUMENTS.NEW_PASSWORD,
      );
    if (!confirmPassword?.trim())
      throw new InvalidArgumentsError(
        ERRORS.FORGOTPASSWORDCODE.INVALID_ARGUMENTS.CONFIRM_PASSWORD,
      );

    if (newPassword !== confirmPassword)
      throw new UnauthorizedError(
        ERRORS.FORGOTPASSWORDCODE.UNAUTHORIZED.PASSWORD,
      );

    const decoded = JWTService.verifyToken(token);
    const user = await UserDAO.getUserFromId(decoded.userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const hashedPassword = await HashingService.hash(newPassword);
    await UserDAO.updateUserPasswordFromId(user._id, hashedPassword);
  }
}

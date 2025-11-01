import {
  generateExpirationDate,
  get4DigitCode,
} from "@/utils/forgotPasswordUtils";
import {
  ConflictError,
  IllegalOperationError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import JWTService from "./jwt";
import UserDAO from "@/db/actions/user";
import ForgotPasswordCodeDAO from "@/db/actions/forgotPasswordCodes";
import EmailService from "./mail";
import {
  validateChangePassword,
  validateSendPasswordCode,
  validateVerifyForgotPasswordCode,
} from "@/utils/serviceUtils/forgotPasswordCodesServiceUtil";
import { Types } from "mongoose";
import { ForgotPasswordCode } from "@/db/models/forgotPasswordCode";
import HashingService from "./hashing";
import ERRORS from "@/utils/errorMessages";
import { Provider } from "@/types/user";
import SettingsService from "./settings";

export default class ForgotPasswordService {
  static async sendPasswordCode(
    email?: string | undefined,
    userId?: string,
  ): Promise<Types.ObjectId> {
    validateSendPasswordCode({ email, userId });
    console.log(email, userId);

    let user;
    if (email) {
      //if email was passed in, we are attempting to do OTP for password
      user = await UserDAO.getUserFromEmail(email);
    } else if (userId) {
      //if userId was passed in, we are attempted to do OTP for parental PIN
      user = await UserDAO.getUserFromId(userId);
    }

    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    if (user.provider !== Provider.PASSWORD && email) {
      throw new IllegalOperationError(
        ERRORS.FORGOTPASSWORDCODE.ILLEGAL_ARGUMENTS.PROVIDER,
      );
    }

    email = user.email;
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
      if (process.env.NODE_ENV === "development") {
        console.log("In development env");
        console.log(emailHtml);
      } else {
        throw new Error(ERRORS.MAIL.FAILURE);
      }
    }

    return user._id;
  }

  static async verifyForgotPasswordCode(
    userId: string,
    code: string,
    pin?: boolean,
  ): Promise<string> {
    validateVerifyForgotPasswordCode({ userId, code });

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

    const settings = await SettingsService.getSettings(userId);
    const fiveMinutes = Date.now() + 5 * 60 * 1000;

    return pin
      ? JWTService.generateToken(
          {
            userId,
            parentalControls: true,
            parentalModeExpiresAt: fiveMinutes,
            origin: "login",
          },
          "90d",
        )
      : JWTService.generateToken(
          {
            userId,
            parentalControls: !!settings.pin,
            origin: "forgot-password",
          },
          "90d",
        );
  }

  static async changePassword(
    userId: string, // This was actually parsed in the Controller's validate path
    newPassword: string,
    confirmPassword: string,
  ) {
    validateChangePassword({
      userId: userId,
      newPassword,
      confirmPassword,
    });

    // const decoded = JWTService.verifyToken(token);
    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }
    if (user.provider !== Provider.PASSWORD) {
      throw new IllegalOperationError(
        ERRORS.FORGOTPASSWORDCODE.ILLEGAL_ARGUMENTS.PROVIDER,
      );
    }

    const hashedPassword = await HashingService.hash(newPassword);
    await UserDAO.updateUserPasswordFromId(user._id, hashedPassword);
  }
}

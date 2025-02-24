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
} from "../db/actions/user";
import { ApiError } from "@/types/exceptions";
import {
  generateEncryptedCode,
  generateExpirationDate,
  get4DigitCode,
} from "@/utils/forgotPasswordUtils";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/types/exceptions";
import { generateTemporaryToken } from "./jwt";
import EmailService from "./mail";

export async function sendPasswordCode(
  email: string | undefined,
): Promise<ObjectId> {
  try {
    if (!email || !email.trim()) {
      // I feel like this is checked way too often because its email | undefined for all these methods
      throw new BadRequestError("Invalid Email.");
    }

    const user = await getUserFromEmail(email);
    const code = get4DigitCode();
    const expirationDate = generateExpirationDate();

    const newCode: ForgotPasswordCode = {
      code: await generateEncryptedCode(code),
      expirationDate,
      userId: user._id,
    };

    const previousForgotPasswordCode = await getForgotPasswordCodeByUserId(
      user._id,
    );

    if (previousForgotPasswordCode) {
      await updateForgotPasswordCodeByUserId(user._id, newCode);
    } else {
      await createForgotPasswordCode(newCode);
    }

    const emailSubject = "iCAN Account Recovery";

    const emailHtml = `<h2> Someone is trying to reset your iCAN account.</h2>
    <p>Your verification code is: ${code}</p>
    <p>If you did not request this, you can ignore this email</p>`;

    await EmailService.sendEmail(email, emailSubject, emailHtml);

    return user._id;
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new Error("Email failed to send.");
    }
    throw error;
  }
}

export async function verifyForgotPasswordCode(
  userIdString: string,
  code: string,
): Promise<string> {
  if (!userIdString || !userIdString.trim()) {
    throw new BadRequestError("User ID is required.");
  }

  if (!code || !code.trim()) {
    throw new BadRequestError("Code is required");
  }

  const userId = new ObjectId(userIdString);

  try {
    const user = await getUserFromId(userId);
    const forgotPasswordCode = await getForgotPasswordCodeByUserId(user._id);

    if (!forgotPasswordCode) {
      throw new NotFoundError(
        "No forgot password code found for this user id.",
      );
    }

    if (new Date() > forgotPasswordCode.expirationDate) {
      throw new ConflictError("Forgot password code has expired.");
    }

    const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
    if (!isMatch) {
      throw new UnauthorizedError("Invalid forgot password code.");
    }

    await deleteForgotPasswordCodeById(forgotPasswordCode._id);

    const token = generateTemporaryToken(userId);
    return token;
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new InternalServerError("An unknown error occurred.");
    }
    throw error;
  }
}

export async function changePassword(
  userId: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (!newPassword || !newPassword.trim()) {
    throw new BadRequestError("New password is required.");
  }

  if (!confirmPassword || !confirmPassword.trim()) {
    throw new BadRequestError("Confirm password is required");
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Passwords do not match.");
  }

  try {
    const user = await getUserFromId(new ObjectId(userId));

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordFromId(user._id, hashedPassword);
  } catch (error) {
    if (!(error instanceof ApiError)) {
      throw new InternalServerError("An unknown error occurred.");
    }
    throw error;
  }
}

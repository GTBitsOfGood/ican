import { ObjectId } from "mongodb";
import {
  createForgotPasswordCode,
  deleteForgotPasswordCodeById,
  getForgotPasswordCodeByUserId,
  updateForgotPasswordCodeByUserId,
} from "../db/actions/forgotPasswordCodes";
import { ForgotPasswordCode } from "../db/models";
import bcrypt from "bcrypt";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { updateUserPasswordFromId } from "../db/actions/user";
import ApiError from "@/services/apiError";

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}
const JWT_SECRET = process.env.JWT_SECRET;

function get4DigitCode(): number {
  return Math.floor(1000 + Math.random() * 9000);
}

function generateExpirationDate(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now;
}

async function generateEncryptedCode(rawCode: number): Promise<string> {
  const encryptedCode = await bcrypt.hash(rawCode.toString(), 10);
  return encryptedCode;
}

export async function generateForgotPasswordCodeForUser(userId: ObjectId) {
  const code = get4DigitCode();
  const expirationDate = generateExpirationDate();
  // send email
  const newCode: ForgotPasswordCode = {
    code: await generateEncryptedCode(code),
    expirationDate,
    userId,
  };
  const previousForgotPasswordCode =
    await getForgotPasswordCodeByUserId(userId);
  if (previousForgotPasswordCode) {
    await updateForgotPasswordCodeByUserId(userId, newCode);
  } else {
    await createForgotPasswordCode(newCode);
  }
}

export async function verifyForgotPasswordCode(
  userId: ObjectId,
  code: string,
): Promise<string> {
  const forgotPasswordCode = await getForgotPasswordCodeByUserId(userId);

  if (!forgotPasswordCode) {
    throw new ApiError("No forgot password code found for this user id.", 404);
  }

  if (new Date() > forgotPasswordCode.expirationDate) {
    throw new ApiError("Forgot password code has expired.", 410);
  }

  const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
  if (!isMatch) {
    throw new ApiError("Invalid forgot password code.", 400);
  }

  await deleteForgotPasswordCodeById(forgotPasswordCode._id);

  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
  return token;
}

export async function changePassword(
  token: string,
  newPassword: string,
  confirmPassword: string,
) {
  if (newPassword !== confirmPassword) {
    throw new ApiError("Passwords do not match.", 400);
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordFromId(new ObjectId(userId), hashedPassword);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ApiError("Invalid or expired token.", 401);
    } else if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError("An unknown error occurred.", 500);
  }
}

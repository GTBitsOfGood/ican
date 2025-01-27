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

if (!process.env.JWT_SECRET) {
  throw new Error('Invalid/Missing environment variable: "JWT_SECRET"');
}
const JWT_SECRET = process.env.JWT_SECRET;

function get6DigitCode(): number {
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
  const code = get6DigitCode();
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
    throw new Error("No forgot password code found for this user id.");
  }

  if (new Date() > forgotPasswordCode.expirationDate) {
    throw new Error("Forgot password code has expired.");
  }

  const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
  if (!isMatch) {
    throw new Error("Invalid forgot password code.");
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
    throw new Error("Passwords do not match.");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordFromId(new ObjectId(userId), hashedPassword);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new Error("Invalid or expired token.");
    }
    throw error;
  }
}

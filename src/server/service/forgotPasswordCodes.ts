import { ObjectId } from "mongodb";
import {
  createForgotPasswordCode,
  deleteForgotPasswordCodeById,
  getForgotPasswordCodeByUserId,
  updateForgotPasswordCodeByUserId,
} from "../db/actions/forgotPasswordCodes";
import bcrypt from "bcrypt";
import { ForgotPasswordCode } from "../db/models";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { updateUserPasswordFromId } from "../db/actions/user";
import ApiError from "@/services/apiError";
import {
  generateEncryptedCode,
  generateExpirationDate,
  get6DigitCode,
} from "@/utils/forgotPasswordUtils";
import {
  BadRequestError,
  ConflictError,
  InternalServerError,
  NotFoundError,
  UnauthorizedError,
} from "@/utils/errors";

if (!process.env.JWT_SECRET) {
  throw new InternalServerError(
    'Invalid/Missing environment variable: "JWT_SECRET"',
  );
}
const JWT_SECRET = process.env.JWT_SECRET;

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
  userIdString: string,
  code: string,
): Promise<string> {
  if (!userIdString || !code) {
    throw new BadRequestError("User ID and code are required.");
  }
  const userId = new ObjectId(userIdString);

  const forgotPasswordCode = await getForgotPasswordCodeByUserId(userId);

  if (!forgotPasswordCode) {
    throw new NotFoundError("No forgot password code found for this user id.");
  }

  if (new Date() > forgotPasswordCode.expirationDate) {
    throw new ConflictError("Forgot password code has expired.");
  }

  const isMatch = await bcrypt.compare(code, forgotPasswordCode.code);
  if (!isMatch) {
    throw new UnauthorizedError("Invalid forgot password code.");
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
  if (!newPassword || !confirmPassword) {
    throw new BadRequestError("Missing required fields.");
  }

  if (newPassword !== confirmPassword) {
    throw new BadRequestError("Passwords do not match");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPasswordFromId(new ObjectId(userId), hashedPassword);
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ConflictError("Invalid or expired token.");
    } else if (error instanceof ApiError) {
      throw error;
    }
    throw new InternalServerError("An unknown error occurred.");
  }
}

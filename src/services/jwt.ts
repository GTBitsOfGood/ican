import { InternalError, UnauthorizedError } from "@/types/exceptions";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ObjectId } from "mongodb";

if (!process.env.JWT_SECRET) {
  throw new InternalError('Invalid/Missing environment variable: "JWT_SECRET"');
}
const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: ObjectId): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string): { userId: string } {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid or expired token.");
    } else {
      throw new InternalError("An unknown error occurred.");
    }
  }
}

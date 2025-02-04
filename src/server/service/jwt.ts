import { InternalServerError, UnauthorizedError } from "@/types/exceptions";
import jwt, { JsonWebTokenError } from "jsonwebtoken";
import { ObjectId } from "mongodb";

if (!process.env.JWT_SECRET) {
  throw new InternalServerError(
    'Invalid/Missing environment variable: "JWT_SECRET"',
  );
}
const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(userId: ObjectId): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
}

export function verifyToken(token: string): { userId: string } {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    return decoded;
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new UnauthorizedError("Invalid or expired token.");
    } else {
      throw new InternalServerError("An unknown error occurred.");
    }
  }
}

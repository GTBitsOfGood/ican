import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function validateParams(
  userId: string | string[] | undefined,
): Promise<void> {
  // Validate parameters
  if (!userId) {
    throw new InvalidBodyError("Invalid parameters: 'userId' is required.");
  }
  if (userId && (typeof userId !== "string" || !ObjectId.isValid(userId))) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }
}

export async function encryptPin(pin: string): Promise<string> {
  const code = await bcrypt.hash(pin, 10);
  return code;
}

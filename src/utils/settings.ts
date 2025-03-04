import { InvalidArgumentsError } from "../types/exceptions";
import { ObjectId } from "mongodb";
import bcrypt from "bcrypt";

export async function validateParams(
  userId: string | string[] | undefined,
): Promise<void> {
  // Validate parameters

  if (!userId) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'userId' is required.",
    );
  }
  if (userId && (typeof userId !== "string" || !ObjectId.isValid(userId))) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }
}

export async function encryptPin(pin: string): Promise<string> {
  const code = await bcrypt.hash(pin, 10);
  return code;
}

export async function validatePins(pinHash: string, pinToCheck: string) {
  console.log(pinHash);
  return await bcrypt.compare(pinToCheck, pinHash);
}

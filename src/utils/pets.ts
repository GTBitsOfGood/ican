import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams(
  userId: string,
  name?: string,
): Promise<void> {
  // Validate parameters
  if (!ObjectId.isValid(userId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }

  // Validate name only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidBodyError(
      "Invalid parameters: 'name' is required and must be a non-empty string.",
    );
  }
}

import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams(userId: string): Promise<void> {
  // Validate parameters
  if (!ObjectId.isValid(userId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }
}

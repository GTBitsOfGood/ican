import { InvalidArgumentsError } from "@/types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams(
  userId: string,
  name?: string,
): Promise<void> {
  // Validate parameters
  if (!ObjectId.isValid(userId)) {
    throw new InvalidArgumentsError(
      "'userId' is required and must be a valid ObjectId.",
    );
  }

  // Validate name
  if (!name || name.trim() === "") {
    throw new InvalidArgumentsError(
      "'name' is required and must be a non-empty string.",
    );
  }
}

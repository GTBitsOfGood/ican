import { InvalidArgumentsError } from "../types/exceptions";
import { ObjectId } from "mongodb";
import ERRORS from "./errorMessages";

export async function validateParams(
  userId: string | string[] | undefined,
): Promise<void> {
  // Validate parameters

  if (!userId) {
    throw new InvalidArgumentsError(ERRORS.SETTINGS.INVALID_ARGUMENTS.UserID);
  }
  if (userId && (typeof userId !== "string" || !ObjectId.isValid(userId))) {
    throw new InvalidArgumentsError(ERRORS.SETTINGS.INVALID_ARGUMENTS.UserID);
  }
}

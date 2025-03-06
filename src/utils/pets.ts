import { PetType } from "@/types/pet";
import { InvalidArgumentsError } from "../types/exceptions";
import { Types } from "mongoose";
import ERRORS from "./errorMessages";

export async function validateParams(
  userId: string,
  name?: string,
  petType?: string,
): Promise<void> {
  if (!Types.ObjectId.isValid(userId)) {
    throw new InvalidArgumentsError(ERRORS.PET.INVALID_ARGUMENTS.USER_ID);
  }

  // Validate name & petType only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidArgumentsError(ERRORS.PET.INVALID_ARGUMENTS.NAME);
  }

  if (petType && !Object.values(PetType).includes(petType as PetType)) {
    throw new InvalidArgumentsError(ERRORS.PET.INVALID_ARGUMENTS.PET_TYPE);
  }
}

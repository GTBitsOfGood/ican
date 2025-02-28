import { PetType } from "@/types/pet";
import { InvalidArgumentsError } from "../types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams(
  userId: string,
  name?: string,
  petType?: string,
): Promise<void> {
  if (!ObjectId.isValid(userId)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }

  // Validate name & petType only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'name' is required and must be a non-empty string.",
    );
  }

  if (petType && !Object.values(PetType).includes(petType as PetType)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'petType' is required and must conform to PetType enum.",
    );
  }
}

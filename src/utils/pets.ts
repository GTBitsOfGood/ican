import { PetType } from "@/types/pet";
import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams({
  userId,
  name,
  petType,
  petId,
}: {
  userId?: string;
  name?: string;
  petType?: string;
  petId?: string;
}): Promise<void> {
  if (userId && !ObjectId.isValid(userId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }

  // Validate name & petType only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidBodyError(
      "Invalid parameters: 'name' is required and must be a non-empty string.",
    );
  }

  if (petType && !Object.values(PetType).includes(petType as PetType)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'petType' is required and must conform to PetType enum.",
    );
  }

  if (petId && !ObjectId.isValid(petId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'petId' is required and must be a valid ObjectId.",
    );
  }
}

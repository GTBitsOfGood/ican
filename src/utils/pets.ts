import { PetType } from "@/types/pet";
import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

export async function validateParams({
  userId,
  name,
  petType,
  petId,
  food,
}: {
  userId?: string;
  name?: string;
  petType?: string;
  petId?: string;
  food?: number;
}): Promise<void> {
  if (userId && !ObjectId.isValid(userId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' must be a valid ObjectId.",
    );
  }

  // Validate name & petType only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidBodyError(
      "Invalid parameters: 'name' must be a non-empty string.",
    );
  }

  if (petType && !Object.values(PetType).includes(petType as PetType)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'petType'  must conform to PetType enum.",
    );
  }

  if (petId && !ObjectId.isValid(petId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'petId' must be a valid ObjectId.",
    );
  }

  if (food && food < 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'food' must be a valid number.",
    );
  }
}

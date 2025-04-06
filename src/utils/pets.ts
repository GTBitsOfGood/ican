import { PetType } from "@/types/pet";
import { InvalidArgumentsError } from "../types/exceptions";
import { Appearance, SavedOutfit } from "@/db/models/pet";
import { ItemType } from "@/types/inventory";
import { Types } from "mongoose";

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
  if (userId && !Types.ObjectId.isValid(userId)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'userId' must be a valid ObjectId.",
    );
  }

  // Validate name & petType only if its passed in
  if (name && (typeof name !== "string" || name.trim() === "")) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'name' must be a non-empty string.",
    );
  }

  if (petType && !Object.values(PetType).includes(petType as PetType)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'petType' must conform to PetType enum.",
    );
  }

  if (petId && !Types.ObjectId.isValid(petId)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'petId' must be a non-empty string.",
    );
  }

  if (food && food < 0) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'food' must be a valid number.",
    );
  }
}

export function compareAppearance(appearance: Appearance, outfit: SavedOutfit) {
  const itemTypesToCompare = Object.values(ItemType).filter(
    (type) => type !== ItemType.FOOD,
  );

  for (const itemType of itemTypesToCompare) {
    const key = itemType;
    if (appearance?.[key] !== outfit?.[key]) {
      return false;
    }
  }
  return true;
}

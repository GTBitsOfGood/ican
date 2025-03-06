import { InvalidArgumentsError } from "@/types/exceptions";
import { AccessoryType, ItemType } from "@/types/store";
import { ObjectId } from "mongodb";

export function validatePetId(petId: string) {
  if (!ObjectId.isValid(petId)) {
    throw new InvalidArgumentsError(
      "Invalid parameters: 'petId' is required and must be a valid ObjectId.",
    );
  }
}

export function validateItemName(itemName: string) {
  if (typeof itemName !== "string" || itemName.trim() === "") {
    throw new InvalidArgumentsError(
      "Invalid request body: 'itemName' is required and must be a non-empty string.",
    );
  }
}

export function validateItemAttribute(attribute: string) {
  if (
    !Object.values(ItemType).includes(attribute as ItemType) &&
    !Object.values(AccessoryType).includes(attribute as AccessoryType)
  ) {
    throw new InvalidArgumentsError(
      "Invalid request body: 'attribute' must be a valid ItemType or AccessoryType.",
    );
  }
}

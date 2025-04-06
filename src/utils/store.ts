import { Appearance } from "@/db/models/pet";
import storeItems from "@/lib/storeItems";
import { InvalidArgumentsError } from "@/types/exceptions";
import { ItemType } from "@/types/inventory";
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
      "Invalid request body: 'name' is required and must be a non-empty string.",
    );
  }
}

export function validateItemAttribute(attribute: string) {
  if (!Object.values(ItemType).includes(attribute as ItemType)) {
    throw new InvalidArgumentsError(
      "Invalid request body: 'attribute' must be a valid ItemType.",
    );
  }
}

export function validateAppearance(appearance: Appearance) {
  Object.entries(appearance).map(([type, name]) => {
    const item = storeItems?.[type]?.[name];
    if (!item) {
      throw new InvalidArgumentsError(
        "Invalid request body: 'The appearance object has items not verified to be in the store.'",
      );
    }
  });
}

import { InvalidBodyError } from "@/types/exceptions";
import { ObjectId } from "mongodb";

export function validatePetId(petId: string) {
  if (!ObjectId.isValid(petId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'petId' is required and must be a valid ObjectId.",
    );
  }
}

export function validateItemName(itemName: string) {
  if (typeof itemName !== "string" || itemName.trim() === "") {
    throw new InvalidBodyError(
      "Invalid request body: 'itemName' is required and must be a non-empty string.",
    );
  }
}

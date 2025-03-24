import BagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { BagItem } from "@/db/models/bag";
import { Pet } from "@/db/models/pet";
import { NotFoundError } from "@/types/exceptions";
import { validatePetId } from "@/utils/store";
import { Types } from "mongoose";

export async function validateBagRequest(petId: string) {
  validatePetId(petId);

  const pet: Pet | null = await PetDAO.getPetByPetId(new Types.ObjectId(petId));
  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const items: BagItem[] = await BagDAO.getPetBag(petId);

  return items;
}

import bagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { BagItem, Pet } from "@/db/models";
import { NotFoundError } from "@/types/exceptions";
import { validatePetId } from "@/utils/store";
import { ObjectId } from "mongodb";

export async function validateBagRequest(petId: string) {
  validatePetId(petId);

  const pet = (await PetDAO.getPetByPetId(new ObjectId(petId))) as Pet;
  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const items = await bagDAO.getPetBag(new ObjectId(petId));

  return items as [BagItem];
}

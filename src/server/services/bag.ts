import { getPetBag } from "@/db/actions/bag";
import { getPetByPetId } from "@/db/actions/pets";
import { BagItem, Pet } from "@/db/models";
import { DoesNotExistError } from "@/types/exceptions";
import { validatePetId } from "@/utils/store";
import { ObjectId } from "mongodb";

export async function validateBagRequest(petId: string) {
  validatePetId(petId);

  const pet = (await getPetByPetId(new ObjectId(petId))) as Pet;
  if (!pet) {
    throw new DoesNotExistError("This pet does not exist.");
  }

  const items = await getPetBag(new ObjectId(petId));

  return items as [BagItem];
}

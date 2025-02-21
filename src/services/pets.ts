import { AlreadyExistsError, DoesNotExistError } from "@/types/exceptions";
import {
  createNewPet,
  deletePetByUserId,
  getPetByPetId,
  getPetByUserId,
  updatePetAppearanceByPetId,
  updatePetNameByUserId,
} from "../db/actions/pets";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import { validateParams } from "@/utils/pets";
import { validateItemName, validatePetId } from "@/utils/store";
import { getBagItemByPetIdAndName } from "@/db/actions/bag";
import { storeItems } from "@/types/store";

export async function createPet(
  userId: string,
  name: string,
  petType: string,
): Promise<Pet> {
  await validateParams(userId, name, petType);

  // Check if the user has a pet already
  const existingPet = await getPetByUserId(new ObjectId(userId));

  if (existingPet) {
    throw new AlreadyExistsError("this user already has a pet");
  }

  const newPet = {
    name: name,
    petType: petType,
    xpGained: 0,
    xpLevel: 0,
    coins: 0,
    userId: new ObjectId(userId),
    appearance: {},
  };

  await createNewPet(newPet);

  return newPet;
}

export async function getPet(userId: string): Promise<Pet | null> {
  await validateParams(userId);

  // Check if the pet exists
  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  return existingPet as Pet;
}

export async function updatePet(userId: string, name: string) {
  await validateParams(userId, name);

  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  await updatePetNameByUserId(new ObjectId(userId), name);
}

export async function validateEquipItem(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const pet = (await getPetByPetId(new ObjectId(petId))) as Pet;
  if (!pet) {
    throw new DoesNotExistError("This pet does not exist.");
  }

  const item = storeItems.find((item) => item.itemName === itemName);
  if (!item) {
    throw new DoesNotExistError("This item does not exist.");
  }

  const dbItem = await getBagItemByPetIdAndName(new ObjectId(petId), itemName);
  if (!dbItem) {
    throw new DoesNotExistError("This pet does not own this item.");
  }

  const prevAppearance = pet.appearance;
  const newAppearance = {
    ...prevAppearance,
    [item.type]: itemName,
  };

  await updatePetAppearanceByPetId(new ObjectId(petId), newAppearance);
}

export async function deletePet(userId: string) {
  await validateParams(userId);

  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  await deletePetByUserId(new ObjectId(userId));
}

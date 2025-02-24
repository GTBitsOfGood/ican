import { AlreadyExistsError, DoesNotExistError } from "@/types/exceptions";
import {
  createNewPet,
  deletePetByUserId,
  getPetByPetId,
  getPetByUserId,
  updatePetByPetId,
  updatePetByUserId,
} from "../db/actions/pets";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import { validateParams } from "@/utils/pets";
import { LEVEL_THRESHOLD, XP_GAIN } from "@/utils/constants";

export async function createPet(
  userId: string,
  name: string,
  petType: string,
): Promise<Pet> {
  await validateParams({ userId, name, petType });

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
  };

  await createNewPet(newPet);

  return newPet;
}

export async function getPet(userId: string): Promise<Pet | null> {
  await validateParams({ userId });

  // Check if the pet exists
  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  return existingPet as Pet;
}

export async function updatePet(userId: string, name: string) {
  await validateParams({ userId, name });

  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  await updatePetByUserId(new ObjectId(userId), name);
}

export async function deletePet(userId: string) {
  await validateParams({ userId });

  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  await deletePetByUserId(new ObjectId(userId));
}

export async function feedPet(petId: string) {
  await validateParams({ petId });

  const existingPet = (await getPetByPetId(new ObjectId(petId))) as Pet;
  if (!existingPet) {
    throw new DoesNotExistError("This pet does not exist");
  }

  const updatedPet: Pet = existingPet;
  if (updatedPet.xpGained > LEVEL_THRESHOLD - XP_GAIN) {
    updatedPet.xpLevel += 1;
    updatedPet.xpGained = (XP_GAIN + updatedPet.xpGained) % LEVEL_THRESHOLD;
  } else {
    updatedPet.xpGained += XP_GAIN;
  }

  await updatePetByPetId(new ObjectId(petId), {
    xpGained: updatedPet.xpGained,
    xpLevel: updatedPet.xpLevel,
  });
}

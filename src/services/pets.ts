import { ConflictError, NotFoundError } from "@/types/exceptions";
import {
  createNewPet,
  deletePetByUserId,
  getPetByUserId,
  updatePetByUserId,
} from "@/db/actions/pets";
import { Pet } from "@/db/models";
import { ObjectId } from "mongodb";
import { validateParams } from "@/utils/pets";

export interface UpdatePetBody {
  name: string;
}

export interface CreatePetBody {
  name: string;
  userId: string;
}

export async function createPet(userId: string, name: string): Promise<Pet> {
  // Validate parameters
  await validateParams(userId, name);

  // Check if the user has a pet already
  const existingPet = await getPetByUserId(new ObjectId(userId));

  if (existingPet) {
    throw new ConflictError("this user already has a pet");
  }

  const newPet = {
    name: name,
    xpGained: 0,
    xpLevel: 0,
    coins: 0,
    userId: new ObjectId(userId),
  };

  await createNewPet(newPet);

  return newPet;
}

export async function getPet(userId: string): Promise<Pet | null> {
  // Validate parameters
  await validateParams(userId);

  // Check if the pet exists
  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new NotFoundError("This pet does not exist");
  }

  return existingPet as Pet;
}

export async function updatePet(userId: string, name: string) {
  // Validate parameters
  await validateParams(userId, name);

  // Check if the pet exists
  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new NotFoundError("This pet does not exist");
  }

  await updatePetByUserId(new ObjectId(userId), name);
}

export async function deletePet(userId: string) {
  // Validate parameters
  await validateParams(userId);

  // Check if the pet exists
  const existingPet = await getPetByUserId(new ObjectId(userId));
  if (!existingPet) {
    throw new NotFoundError("This pet does not exist");
  }

  await deletePetByUserId(new ObjectId(userId));
}

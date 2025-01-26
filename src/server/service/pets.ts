import {
  deletePetByUserId,
  getPetByUserId,
  updatePetByUserId,
} from "../db/actions/pets";
import { Pet } from "../db/models";

export interface UpdatePetBody {
  name: string;
}

export async function getTypedPets(id: number): Promise<Pet | null> {
  const petData = await getPetByUserId(id);

  if (!petData) return null;

  //Convert data to Pet type
  const typedPet = {
    name: petData.name,
    xpGained: petData.xpGained,
    xpLevel: petData.xpLevel,
    coins: petData.coins,
    userId: petData.userId,
  } as Pet;

  return typedPet;
}

export async function typedUpdatePet(
  id: number,
  name: string,
): Promise<Pet | null> {
  const updatedPet = await updatePetByUserId(id, name);

  if (!updatedPet) {
    return null;
  }

  const typedPet: Pet = {
    name: updatedPet.name,
    xpGained: updatedPet.xpGained,
    xpLevel: updatedPet.xpLevel,
    coins: updatedPet.coins,
    userId: updatedPet.userId,
  };

  return typedPet;
}

export async function typedDeletePet(id: number): Promise<Pet | null> {
  const deletedPet = await deletePetByUserId(id);

  if (!deletedPet) return null;

  const typedPet = {
    name: deletedPet.name,
    xpGained: deletedPet.xpGained,
    xpLevel: deletedPet.xpLevel,
    coins: deletedPet.coins,
    userId: deletedPet.userId,
  } as Pet;

  return typedPet;
}

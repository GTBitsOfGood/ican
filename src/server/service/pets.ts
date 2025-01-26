import { getPetByUserId, updatePetName } from "../db/actions/pets";
import { Pet } from "../db/models";

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

interface UpdatePetBody {
  name: string;
}

export async function typedUpdatePet(
  id: number,
  body: UpdatePetBody,
): Promise<Pet | null> {
  const updatedPetData = await updatePetName(id, body.name);

  if (!updatedPetData) {
    return null;
  }

  const updatedPet: Pet = {
    name: updatedPetData.value.name,
    xpGained: updatedPetData.value.xpGained,
    xpLevel: updatedPetData.value.xpLevel,
    coins: updatedPetData.value.coins,
    userId: updatedPetData.value.userId,
  };

  return updatedPet;
}

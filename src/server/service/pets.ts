import { getPetsByUserId } from "../db/actions/pets";
import { Pet } from "../db/models";

export async function getTypedPets(id: number): Promise<Pet | null> {
  const petData = await getPetsByUserId(id);

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

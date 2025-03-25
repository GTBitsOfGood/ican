import { storeItems } from "@/types/store";
import { validateItemName, validatePetId } from "@/utils/store";
import BagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { InvalidArgumentsError, NotFoundError } from "@/types/exceptions";
import { Pet } from "@/db/models/pet";

export async function validatePurchase(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const item = storeItems.find((item) => item.itemName === itemName);
  const pet: Pet | null = await PetDAO.getPetByPetId(petId);

  if (!item) {
    throw new NotFoundError("This item does not exist.");
  }

  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const dbItem = await BagDAO.getBagItemByPetIdAndName(petId, itemName);
  if (dbItem) {
    throw new InvalidArgumentsError("This pet already owns this item.");
  }

  if (pet.coins < item.cost) {
    throw new InvalidArgumentsError("This pet does not have enough coins.");
  }

  await BagDAO.createBagItem(petId, itemName);
  await PetDAO.updatePetCoinsByPetId(petId, pet.coins - item.cost);
}

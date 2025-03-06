import { storeItems } from "@/types/store";
import { validateItemName, validatePetId } from "@/utils/store";
import { ObjectId } from "mongodb";
import { BagItem, Pet } from "@/db/models";
import { getBagItemByPetIdAndName, createBagItem } from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { InvalidArgumentsError, NotFoundError } from "@/types/exceptions";

export async function validatePurchase(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const item = storeItems.find((item) => item.itemName === itemName);
  const pet = (await PetDAO.getPetByPetId(new ObjectId(petId))) as Pet;

  if (!item) {
    throw new NotFoundError("This item does not exist.");
  }

  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const dbItem = await getBagItemByPetIdAndName(new ObjectId(petId), itemName);
  if (dbItem) {
    throw new InvalidArgumentsError("This pet already owns this item.");
  }

  if (pet.coins < item.cost) {
    throw new InvalidArgumentsError("This pet does not have enough coins.");
  }

  const newItem: BagItem = {
    petId: new ObjectId(petId),
    itemName: itemName,
  };

  await createBagItem(newItem);
  await PetDAO.updatePetCoinsByPetId(newItem.petId, pet.coins - item.cost);
}

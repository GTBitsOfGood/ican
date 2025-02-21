import { BadRequestError, DoesNotExistError } from "@/types/exceptions";
import { storeItems } from "@/types/store";
import { validateItemName, validatePetId } from "@/utils/store";
import { getPetByPetId } from "@/db/actions/pets";
import { ObjectId } from "mongodb";
import { BagItem, Pet } from "@/db/models";
import { getBagItemByPetIdAndName, purchaseItem } from "@/db/actions/bag";

export async function validatePurchase(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const item = storeItems.find((item) => item.itemName === itemName);
  const pet = (await getPetByPetId(new ObjectId(petId))) as Pet;

  if (!item) {
    throw new DoesNotExistError("This item does not exist.");
  }

  if (!pet) {
    throw new DoesNotExistError("This pet does not exist.");
  }

  if (pet.coins < item.cost) {
    throw new BadRequestError("This pet does not have enough coins.");
  }

  const dbItem = await getBagItemByPetIdAndName(new ObjectId(petId), itemName);
  if (dbItem) {
    throw new BadRequestError("This pet already owns this item.");
  }

  const newItem: BagItem = {
    petId: new ObjectId(petId),
    itemName: itemName,
  };

  await purchaseItem(newItem, pet.coins - item.cost);
}

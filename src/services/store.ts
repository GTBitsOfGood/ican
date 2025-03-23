import { storeItems } from "@/types/store";
import { validateItemName, validatePetId } from "@/utils/store";
import { Pet } from "@/db/models";
import { BagItem } from "@/db/models/bag";
import bagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { InvalidArgumentsError, NotFoundError } from "@/types/exceptions";
import { Types } from "mongoose";

export async function validatePurchase(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const item = storeItems.find((item) => item.itemName === itemName);
  const pet = (await PetDAO.getPetByPetId(new Types.ObjectId(petId))) as Pet;

  if (!item) {
    throw new NotFoundError("This item does not exist.");
  }

  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const dbItem = await bagDAO.getBagItemByPetIdAndName(
    new Types.ObjectId(petId),
    itemName,
  );
  if (dbItem) {
    throw new InvalidArgumentsError("This pet already owns this item.");
  }

  if (pet.coins < item.cost) {
    throw new InvalidArgumentsError("This pet does not have enough coins.");
  }

  const newItem: BagItem = {
    petId: new Types.ObjectId(petId),
    itemName: itemName,
  };

  await bagDAO.createBagItem(newItem);
  await PetDAO.updatePetCoinsByPetId(newItem.petId, pet.coins - item.cost);
}

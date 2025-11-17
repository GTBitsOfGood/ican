import storeItems from "@/lib/storeItems";
import {
  validateItemAttribute,
  validateItemName,
  validatePetId,
} from "@/utils/store";
import BagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { InvalidArgumentsError, NotFoundError } from "@/types/exceptions";
import { Pet } from "@/db/models/pet";

export default class StoreService {
  static async validatePurchase(petId: string, name: string, type: string) {
    validatePetId(petId);
    validateItemName(name);
    validateItemAttribute(type);

    const item = storeItems?.[type]?.[name];
    if (!item) {
      throw new NotFoundError("This item does not exist.");
    }

    const pet: Pet | null = await PetDAO.getPetByPetId(petId);
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    const dbItem = await BagDAO.getBagItemByPetIdAndName(petId, name);
    if (dbItem) {
      throw new InvalidArgumentsError("This pet already owns this item.");
    }

    if (item.isStreakLocked) {
      const requiredStreak = item.streakRequirement || 3;
      if (pet.currentStreak < requiredStreak) {
        throw new InvalidArgumentsError(
          `You need an active streak of at least ${requiredStreak} days to purchase this item! Current streak: ${pet.currentStreak} days.`,
        );
      }
    }

    if (pet.coins < item.cost) {
      throw new InvalidArgumentsError("This pet does not have enough coins.");
    }

    await BagDAO.createBagItem(petId, name, type);
    await PetDAO.updatePetCoinsByPetId(petId, pet.coins - item.cost);
  }
}

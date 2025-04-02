import BagDAO from "@/db/actions/bag";
import PetDAO from "@/db/actions/pets";
import { BagItem } from "@/db/models/bag";
import { Pet } from "@/db/models/pet";
import storeItems from "@/lib/storeItems";
import { NotFoundError } from "@/types/exceptions";
import { InventoryItem } from "@/types/inventory";
import { validatePetId } from "@/utils/store";

export async function validateBagRequest(
  petId: string,
): Promise<Record<string, InventoryItem[]>> {
  validatePetId(petId);

  const pet: Pet | null = await PetDAO.getPetByPetId(petId);
  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const groups = await BagDAO.getPetBagGroupedByType(petId);

  const result: Record<string, InventoryItem[]> = {};
  groups.forEach((group) => {
    result[group._id] = group.items.map(
      (item: BagItem) => storeItems[item.type][item.name],
    );
  });
  return result;
}

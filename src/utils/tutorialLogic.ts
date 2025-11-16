import { Pet } from "@/types/pet";
import { WithId } from "@/types/models";
import { Bag, InventoryItem } from "@/types/inventory";
import { LEVEL_THRESHOLD } from "@/utils/constants";
import storeItems from "@/lib/storeItems";

interface XPUpdateResult {
  xpGained: number;
  xpLevel: number;
}

function calculateXPUpdate(
  currentXP: number,
  currentLevel: number,
  xpToAdd: number,
): XPUpdateResult {
  let newXp = currentXP + xpToAdd;
  let newLevel = currentLevel;

  if (newXp >= LEVEL_THRESHOLD) {
    newLevel += 1;
    newXp = newXp - LEVEL_THRESHOLD;
  }

  return { xpGained: newXp, xpLevel: newLevel };
}

export function calculateTutorialPetFeed(pet: WithId<Pet>): WithId<Pet> {
  const { xpGained, xpLevel } = calculateXPUpdate(
    pet.xpGained,
    pet.xpLevel,
    10,
  );

  return {
    ...pet,
    xpGained,
    xpLevel,
    food: pet.food - 1,
  };
}

export function calculateTutorialMedicationLog(pet: WithId<Pet>): WithId<Pet> {
  const { xpGained, xpLevel } = calculateXPUpdate(
    pet.xpGained,
    pet.xpLevel,
    50,
  );

  return {
    ...pet,
    xpGained,
    xpLevel,
    coins: pet.coins + 10,
    food: pet.food + 1,
  };
}

export function calculateTutorialPurchase(
  pet: WithId<Pet>,
  bag: Bag,
  itemName: string,
  itemType: string,
  cost: number,
): { pet: WithId<Pet>; bag: Bag } {
  const updatedBag = { ...bag };
  const key = itemType as keyof Bag;

  if (Array.isArray(updatedBag[key])) {
    const item = storeItems[itemType][itemName];
    if (item) {
      (updatedBag[key] as InventoryItem[]).push(item);
    }
  }

  const updatedPet = {
    ...pet,
    coins: pet.coins - cost,
  };

  return { pet: updatedPet, bag: updatedBag };
}

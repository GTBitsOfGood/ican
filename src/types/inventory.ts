export enum ItemType {
  CLOTHING = "clothing",
  BACKGROUND = "background",
  FOOD = "food",
  SHOES = "shoes",
  EYEWEAR = "eyewear",
  HAT = "hat",
  OCCUPATION = "occupation",
}

export enum ItemPrice {
  CHEAP = 10,
  MEDIUM = 25,
  EXPENSIVE = 50,
}

export interface InventoryItem {
  name: string;
  displayName: string;
  type: ItemType;
  image: string;
  cost: number;
  level: number;
  description: string;
  isStreakLocked?: boolean;
  streakRequirement?: number; // min streak days needed to unlock
}

export interface Bag {
  clothing: InventoryItem[];
  shoes: InventoryItem[];
  hat: InventoryItem[];
  occupation: InventoryItem[];
  background: InventoryItem[];
  food: InventoryItem[];
}

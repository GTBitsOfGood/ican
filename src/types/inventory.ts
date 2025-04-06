export enum ItemType {
  CLOTHING = "clothing",
  BACKGROUND = "background",
  FOOD = "food",
  SHOES = "shoes",
  EYEWEAR = "eyewear",
  HAT = "hat",
  OCCUPATION = "occupation",
}

export interface InventoryItem {
  name: string;
  displayName: string;
  type: ItemType;
  image: string;
  cost: number;
  level: number;
  description: string;
}

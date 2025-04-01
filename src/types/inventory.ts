export enum ItemType {
  CLOTHING = "clothing",
  BACKGROUND = "background",
  FOOD = "food",
  ACCESSORY = "accessory",
}

export enum AccessoryCategory {
  SHOES = "shoes",
  EYEWEAR = "eyewear",
  HAT = "hat",
  OCCUPATION = "occupation",
}

export interface InventoryItem {
  name: string;
  displayName: string;
  type: ItemType;
  category?: AccessoryCategory;
  image: string;
  cost: number;
  level: number;
  description: string;
}

export enum ItemType {
  CLOTHES = "clothes",
  BACKGROUND = "background",
  FOOD = "food",
}

export enum AccessoryType {
  SHOES = "shoes",
  EYEWEAR = "eyewear",
  HAT = "hat",
  OCCUPATION = "occupation",
}

// Tentative store items
export const storeItems = [
  {
    itemName: "cool shirt",
    type: ItemType.CLOTHES,
    cost: 100,
  },
  {
    itemName: "surgeon clothes",
    type: ItemType.CLOTHES,
    cost: 100,
  },
  {
    itemName: "astronaut clothes",
    type: ItemType.CLOTHES,
    cost: 100,
  },
  {
    itemName: "business clothes",
    type: ItemType.CLOTHES,
    cost: 100,
  },
  {
    itemName: "painter clothes",
    type: ItemType.CLOTHES,
    cost: 100,
  },
  {
    itemName: "musician shoes",
    type: AccessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "astronaut shoes",
    type: AccessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "business shoes",
    type: AccessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "musician hat",
    type: AccessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "sunglasses",
    type: AccessoryType.EYEWEAR,
    cost: 100,
  },
  {
    itemName: "business hat",
    type: AccessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "doctor hat",
    type: AccessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "painter accessory",
    type: AccessoryType.OCCUPATION,
    cost: 100,
  },
  {
    itemName: "business accessory",
    type: AccessoryType.OCCUPATION,
    cost: 100,
  },
  {
    itemName: "doctor accessory",
    type: AccessoryType.OCCUPATION,
    cost: 100,
  },
];

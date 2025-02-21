export enum ItemType {
  CLOTHES = "clothes",
  BACKGROUND = "background",
  FOOD = "food",
}

export enum AcessoryType {
  SHOES = "shoes",
  EYEWEAR = "eyewear",
  HAT = "hat",
  OCCUPATION = "occupation",
}

// Tentative store items
export const storeItems = [
  {
    itemName: "default clothes",
    type: ItemType.CLOTHES,
    cost: 0,
  },
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
    itemName: "default shoes",
    type: AcessoryType.SHOES,
    cost: 0,
  },
  {
    itemName: "musician shoes",
    type: AcessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "astronaut shoes",
    type: AcessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "business shoes",
    type: AcessoryType.SHOES,
    cost: 100,
  },
  {
    itemName: "musician hat",
    type: AcessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "sunglasses",
    type: AcessoryType.EYEWEAR,
    cost: 100,
  },
  {
    itemName: "business hat",
    type: AcessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "doctor hat",
    type: AcessoryType.HAT,
    cost: 100,
  },
  {
    itemName: "painter accessory",
    type: AcessoryType.OCCUPATION,
    cost: 100,
  },
  {
    itemName: "business accessory",
    type: AcessoryType.OCCUPATION,
    cost: 100,
  },
  {
    itemName: "doctor accessory",
    type: AcessoryType.OCCUPATION,
    cost: 100,
  },
  {
    itemName: "default background",
    type: ItemType.BACKGROUND,
    cost: 0,
  },
];

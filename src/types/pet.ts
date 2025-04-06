import { Appearance, SavedOutfit } from "@/db/models/pet";

export enum PetType {
  DOG = "dog",
  CAT = "cat",
  DUCK = "duck",
  DINO = "dino",
  PENGUIN = "penguin",
}

export interface Pet {
  _id?: string;
  name: string;
  petType: PetType;
  xpGained: number;
  xpLevel: number;
  coins: number;
  userId: string;
  food: number;
  appearance: Appearance;
  outfits: SavedOutfit[];
}

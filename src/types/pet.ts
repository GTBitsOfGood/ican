import { Appearance, SavedOutfit } from "@/db/models/pet";

export enum PetType {
  DOG = "dog",
  CAT = "cat",
  DUCK = "duck",
  DINO = "dino",
  PENGUIN = "penguin",
}

export enum PetEmotion {
  HAPPY = "happy",
  SAD = "sad",
  NEUTRAL = "neutral",
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
  lastFedAt: string | null;
  appearance: Appearance;
  outfits: SavedOutfit[];
}

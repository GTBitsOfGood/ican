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
  appearance: {
    clothing?: string;
    accessory?: {
      shoes?: string;
      eyewear?: string;
      hat?: string;
      occupation?: string;
    };
    background?: string;
    food?: string;
  };
}

import { PetType } from "./pet";

export type CharacterType = "cat" | "dino" | "dog" | "duck" | "penguin";

// Thinking of moving this into utils
export const characterImages: Record<PetType, string> = {
  cat: "/characters/cat.png",
  dino: "/characters/dino.png",
  dog: "/characters/dog.png",
  duck: "/characters/duck.png",
  penguin: "/characters/penguin.png",
};

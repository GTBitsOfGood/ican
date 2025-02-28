import { StaticImageData } from "next/image";
import { PetType } from "./pet";
import catImg from "/public/characters/cat.gif";
import dinoImg from "/public/characters/dino.gif";
import dogImg from "/public/characters/dog.gif";
import duckImg from "/public/characters/duck.gif";
import penguinImg from "/public/characters/penguin.gif";

export type CharacterType = "cat" | "dino" | "dog" | "duck" | "penguin";

// Thinking of moving this into utils
export const characterImages: Record<PetType, StaticImageData> = {
  cat: catImg,
  dino: dinoImg,
  dog: dogImg,
  duck: duckImg,
  penguin: penguinImg,
};

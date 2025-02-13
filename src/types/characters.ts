import { StaticImageData } from "next/image";
import catImg from "/public/characters/cat.svg";
import dinoImg from "/public/characters/dino.svg";
import dogImg from "/public/characters/dog.svg";
import duckImg from "/public/characters/duck.svg";
import penguinImg from "/public/characters/penguin.svg";

export type CharacterType = "cat" | "dino" | "dog" | "duck" | "penguin";

// Thinking of moving this into utils
export const characterImages: Record<CharacterType, StaticImageData> = {
  cat: catImg,
  dino: dinoImg,
  dog: dogImg,
  duck: duckImg,
  penguin: penguinImg,
};

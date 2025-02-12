import { StaticImageData } from "next/image";
import catImg from "/public/characters/cat.png";
import dinoImg from "/public/characters/dino.png";
import dogImg from "/public/characters/dog.png";
import duckImg from "/public/characters/duck.png";
import penguinImg from "/public/characters/penguin.png";
import { PetType } from "./pet";
// Thinking of moving this into utils
export const characterImages: Record<PetType, StaticImageData> = {
  cat: catImg,
  dino: dinoImg,
  dog: dogImg,
  duck: duckImg,
  penguin: penguinImg,
};

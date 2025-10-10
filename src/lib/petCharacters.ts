import { PetType } from "@/types/pet";

export interface PetCharacter {
  type: PetType;
  name: string;
  description: string;
  image: string;
}

export const PET_CHARACTERS: PetCharacter[] = [
  {
    type: PetType.DOG,
    name: "Paws!",
    description:
      "Paws is loyal and playful. He loves running around and giving warm hugs to friends!",
    image: "/characters/dog.svg",
  },
  {
    type: PetType.DINO,
    name: "Roary!",
    description:
      "Roary is the friendliest dinosaur around. He stomps with joy and gives the biggest high-fives!",
    image: "/characters/dino.svg",
  },
  {
    type: PetType.CAT,
    name: "Whiskers!",
    description:
      "Whiskers is curious and loves adventures. Pick Cat if you enjoy exploring and trying new things!",
    image: "/characters/cat.svg",
  },
  {
    type: PetType.PENGUIN,
    name: "Waddles!",
    description:
      "Waddles loves sliding on ice and dancing to music. Choose Penguin if you like to groove and play!",
    image: "/characters/penguin.svg",
  },
  {
    type: PetType.DUCK,
    name: "Quacky!",
    description:
      "Quacky loves splashing in puddles and telling silly jokes. Pick Duck if you like making everyone laugh!",
    image: "/characters/duck.svg",
  },
];

export const getPetCharacterByType = (type: PetType) => {
  return PET_CHARACTERS.find((character) => character.type === type);
};

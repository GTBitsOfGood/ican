import { PetEmotion, PetType } from "./pet";

export type CharacterType = "cat" | "dino" | "dog" | "duck" | "penguin";

/**
 * Returns the character image path for a given pet type and emotion.
 * Neutral uses the base image (e.g. /characters/cat.png),
 * while happy/sad append a suffix (e.g. /characters/cat_happy.png).
 */
export function getCharacterImage(
  petType: PetType,
  emotion: PetEmotion = PetEmotion.NEUTRAL,
): string {
  const suffix = emotion === PetEmotion.NEUTRAL ? "" : `_${emotion}`;
  return `/characters/${petType}${suffix}.png`;
}

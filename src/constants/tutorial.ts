export const TUTORIAL_PORTIONS = {
  FOOD_TUTORIAL: 0,
  LOG_TUTORIAL: 1,
  FEED_TUTORIAL: 2,
  END_TUTORIAL: 3,
} as const;

export const TUTORIAL_DIALOGUES: Record<number, readonly string[]> = {
  [TUTORIAL_PORTIONS.FOOD_TUTORIAL]: [
    "Hi, {userName}! Welcome to ICAN Pill Pal! Click any key to continue.",
    "I'm your pet, {petName}! Take care of me to make me happy!",
    "When you take your medicine on time, you can unlock coins to buy food and accessories.",
    "Here are some coins to get you started! Let's go to the STORE to buy some food!",
  ],
  [TUTORIAL_PORTIONS.LOG_TUTORIAL]: [
    "You need to take your medication within 15 minutes of the set time indicated.",
    "After, go to LOG to log that you took it!",
  ],
  [TUTORIAL_PORTIONS.FEED_TUTORIAL]: [
    "Good job taking your medications! Now, feed me to gain XP!",
    "Drag the food into my mouth to feed me!",
  ],
  [TUTORIAL_PORTIONS.END_TUTORIAL]: [
    "Yummy! Thank you for feeding me, {userName}!",
    "You earned XP! With more XP you'll be able to level up and earn coins to unlock more items.",
    "You can access this tutorial again in HELP.",
    "See you soon, {userName}!",
  ],
};

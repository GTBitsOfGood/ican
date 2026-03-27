export const calculateXPForLevel = (level: number): number => {
  return 90 + level * 10;
};
export const XP_GAIN = 5;
export const FOOD_INC = 1;

// Game rewards constants
export const GAMES_COINS_BASE = 5;
export const GAMES_COINS_PER_STREAK = 1;
export const GAMES_DAILY_COIN_LIMIT = 50;
export const MAX_STREAK_DAYS = 7;

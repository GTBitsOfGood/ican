export const calculateXPForLevel = (level: number): number => {
  return 90 + level * 10;
};

export const XP_GAIN = 5;
export const FOOD_INC = 1;

// Game rewards constants
export const COINS_PER_WIN = 10;
export const GAMES_COINS_BASE = 5;
export const GAMES_COINS_PER_STREAK = 1;
export const GAMES_DAILY_COIN_LIMIT = 50;
export const MAX_STREAK_DAYS = 7;
export const PERFECT_WEEK_BONUS = 15; // coins awarded for 7 day streak
export const STREAK_START_DAYS = 3; // days needed to start a streak
export const PERFECT_WEEK_DAYS = 7; // days in a perfect week
export const STREAK_MILESTONES = [30, 50, 100, 150, 200, 365]; // milestone days for special popups

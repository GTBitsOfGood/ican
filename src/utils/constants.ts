export const calculateXPForLevel = (level: number): number => {
  return 90 + level * 10;
};

export const XP_GAIN = 5;
export const FOOD_INC = 1;

export const PERFECT_WEEK_BONUS = 15; // coins awarded for 7 day streak
export const STREAK_START_DAYS = 3; // days needed to start a streak
export const PERFECT_WEEK_DAYS = 7; // days in a perfect week
export const STREAK_MILESTONES = [30, 50, 100, 150, 200, 365]; // milestone days for special popups

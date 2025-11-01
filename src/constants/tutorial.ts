export const TUTORIAL_STORAGE_KEYS = {
  CURRENT_PROGRESS: "tutorialCurrentPortion",
} as const;

interface TutorialProgressPayload {
  userId: string | null;
  portion: number;
  step: number;
}

const isBrowser = () => typeof window !== "undefined";

export const readTutorialProgress = (
  userId: string | null,
): TutorialProgressPayload | null => {
  if (!isBrowser()) return null;

  const raw = localStorage.getItem(TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as TutorialProgressPayload;
    if (parsed?.userId === userId) {
      return parsed;
    }
  } catch (error) {
    console.warn("Unable to parse tutorial progress", error);
  }

  return null;
};

export const writeTutorialProgress = (
  userId: string | null,
  portion: number,
  step: number,
): void => {
  if (!isBrowser()) return;

  const payload: TutorialProgressPayload = {
    userId,
    portion,
    step,
  };

  localStorage.setItem(
    TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS,
    JSON.stringify(payload),
  );
};

export const clearTutorialProgress = (userId?: string | null): void => {
  if (!isBrowser()) return;

  const raw = localStorage.getItem(TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS);
  if (!raw) return;

  if (userId === undefined) {
    localStorage.removeItem(TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS);
    return;
  }

  try {
    const parsed = JSON.parse(raw) as TutorialProgressPayload;
    if (parsed?.userId === userId) {
      localStorage.removeItem(TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS);
    }
  } catch (error) {
    console.warn("Unable to parse tutorial progress for clearing", error);
    localStorage.removeItem(TUTORIAL_STORAGE_KEYS.CURRENT_PROGRESS);
  }
};

export const TUTORIAL_PORTIONS = {
  FOOD_TUTORIAL: 0,
  LOG_TUTORIAL: 1,
  FEED_TUTORIAL: 2,
  END_TUTORIAL: 3,
} as const;

export const PRACTICE_DOSE_ID = "practice-dose" as const;

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

export const getPracticeDose = () => {
  const now = new Date();
  const scheduledTime = new Date(now.getTime() + 10 * 60 * 1000);

  return {
    id: PRACTICE_DOSE_ID,
    name: "Practice Dose",
    dosage: "1 pill",
    notes: "",
    scheduledDoseTime: scheduledTime.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    canCheckIn: true,
    status: "pending" as const,
    lastTaken: "",
    repeatUnit: "days" as const,
    repeatInterval: 1,
  };
};

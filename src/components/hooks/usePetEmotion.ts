import { useState, useEffect } from "react";
import { PetEmotion } from "@/types/pet";
import { useUpcomingMedication } from "./useMedication";

const HAPPY_DURATION_MS = 10 * 60 * 1000; // 10 minutes
const TICK_INTERVAL_MS = 15 * 1000; // re-evaluate every 15 seconds

/**
 * Derives the pet's current emotion based on:
 *  1. Happy — (highest priority) pet was fed within the last 10 minutes.
 *             After 10 min expires, falls back to sad if applicable.
 *  2. Sad   — a dose is within its check-in window and hasn't been taken yet.
 *             Once the window passes, the pet returns to neutral.
 *  3. Neutral — otherwise.
 *
 * The tick only runs when a time-based transition is possible (happy timer
 * counting down, or a pending medication that could change the check-in window).
 * When the pet is stable at neutral with no pending transitions, no tick runs.
 */
export const usePetEmotion = (
  lastFedAt: string | null | undefined,
): PetEmotion => {
  const [, setTick] = useState(0);

  const now = new Date();
  const { hasMedication } = useUpcomingMedication();

  // Determine if a time-based transition is necessary
  const isHappy = lastFedAt
    ? now.getTime() - new Date(lastFedAt).getTime() < HAPPY_DURATION_MS
    : false;
  const needsTick = isHappy || hasMedication;

  useEffect(() => {
    if (!needsTick) return;
    const interval = setInterval(() => setTick((t) => t + 1), TICK_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [needsTick]);

  // --- Happy check (takes priority — temporarily overrides sad) ---
  if (isHappy) {
    return PetEmotion.HAPPY;
  }

  // --- Sad check ---
  // Emotion is sad if it's within the +/- 15min window and the medication is not yet taken
  // Emotion is not sad if the medication was missed, but it's outside of the +/- 15min window
  // hasMedication is true when there's a pending dose with canCheckIn === true
  if (hasMedication) {
    return PetEmotion.SAD;
  }

  return PetEmotion.NEUTRAL;
};

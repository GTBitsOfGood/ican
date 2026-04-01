export enum Provider {
  GOOGLE = "google",
  PASSWORD = "password",
}

export enum ChildPasswordType {
  NORMAL = "normal",
  COLOR = "color",
  SHAPE = "shape",
  EMOJI = "emoji",
  PATTERN = "pattern",
}

export enum LoginType {
  PARENT = "parent",
  CHILD = "child",
}

export const TUTORIAL_STATES = [
  "food",
  "medication",
  "feed",
  "complete",
] as const;

export type TutorialState = (typeof TUTORIAL_STATES)[number];

export const TUTORIAL_MODES = ["initial", "replay"] as const;

export type TutorialMode = (typeof TUTORIAL_MODES)[number];

export type TutorialMedicationType = "Pill" | "Syrup" | "Shot";

export interface TutorialStatus {
  tutorialCompleted: boolean;
  tutorialState: TutorialState;
  tutorialMode: TutorialMode | null;
  tutorialStep: number;
  tutorialMedicationType: TutorialMedicationType | null;
  tutorialShouldShowMedicationDrag: boolean;
}

export const isPatternChildPasswordType = (
  value: ChildPasswordType | null | undefined,
): value is
  | ChildPasswordType.COLOR
  | ChildPasswordType.SHAPE
  | ChildPasswordType.EMOJI
  | ChildPasswordType.PATTERN => {
  return (
    value === ChildPasswordType.COLOR ||
    value === ChildPasswordType.SHAPE ||
    value === ChildPasswordType.EMOJI ||
    value === ChildPasswordType.PATTERN
  );
};

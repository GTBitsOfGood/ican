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

export const INITIAL_TUTORIAL_STAGES = [
  "food",
  "medication",
  "feed",
  "end",
  "complete",
] as const;

export type InitialTutorialStage = (typeof INITIAL_TUTORIAL_STAGES)[number];

export interface TutorialStatus {
  initialTutorialStage: InitialTutorialStage;
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

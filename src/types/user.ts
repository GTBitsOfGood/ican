export enum Provider {
  GOOGLE = "google",
  PASSWORD = "password",
}

export enum ChildPasswordType {
  NORMAL = "normal",
  COLOR = "color",
  SHAPE = "shape",
  EMOJI = "emoji",
}

export enum LoginType {
  PARENT = "parent",
  CHILD = "child",
}

export const isPatternChildPasswordType = (
  value: ChildPasswordType | null | undefined,
): value is
  | ChildPasswordType.COLOR
  | ChildPasswordType.SHAPE
  | ChildPasswordType.EMOJI => {
  return (
    value === ChildPasswordType.COLOR ||
    value === ChildPasswordType.SHAPE ||
    value === ChildPasswordType.EMOJI
  );
};

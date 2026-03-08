import { CSSProperties } from "react";
import { ChildPasswordType, isPatternChildPasswordType } from "@/types/user";

export interface ChildPasswordTile {
  token: string;
  label: string;
  style: CSSProperties;
  content?: string;
}

export type PatternChildPasswordType =
  | ChildPasswordType.COLOR
  | ChildPasswordType.SHAPE
  | ChildPasswordType.EMOJI
  | ChildPasswordType.PATTERN;

export const childPatternTiles: Record<
  PatternChildPasswordType,
  ChildPasswordTile[]
> = {
  [ChildPasswordType.COLOR]: [
    { token: "sage", label: "Sage", style: { backgroundColor: "#538B6E" } },
    { token: "salmon", label: "Salmon", style: { backgroundColor: "#F5A49D" } },
    {
      token: "blush",
      label: "Blush",
      style: { backgroundColor: "#F6DBDB" },
    },
    {
      token: "mist",
      label: "Mist",
      style: { backgroundColor: "#F7FEFF" },
    },
    { token: "iris", label: "Iris", style: { backgroundColor: "#7C4D90" } },
    { token: "mint", label: "Mint", style: { backgroundColor: "#DDF6DF" } },
    {
      token: "mustard",
      label: "Mustard",
      style: { backgroundColor: "#E0CC46" },
    },
    {
      token: "crimson",
      label: "Crimson",
      style: { backgroundColor: "#B62735" },
    },
    {
      token: "rose",
      label: "Rose",
      style: { backgroundColor: "#DC9DAA" },
    },
  ],
  [ChildPasswordType.SHAPE]: [
    {
      token: "circle",
      label: "Star",
      content: "●",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "square",
      label: "Heart",
      content: "■",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "triangle",
      label: "Spiral",
      content: "▲",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "diamond",
      label: "Diamond",
      content: "◆",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "star",
      label: "Flower",
      content: "★",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "heart",
      label: "Cloud",
      content: "♥",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "club",
      label: "Moon",
      content: "♣",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "spade",
      label: "Burst",
      content: "♠",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "sun",
      label: "Octagon",
      content: "☀",
      style: { backgroundColor: "#FAFAFA" },
    },
  ],
  [ChildPasswordType.EMOJI]: [
    {
      token: "smile",
      label: "Smile",
      content: "😀",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "cool",
      label: "Cool",
      content: "😎",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "love",
      label: "Love",
      content: "😍",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "party",
      label: "Party",
      content: "🥳",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "robot",
      label: "Robot",
      content: "🤖",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "cat",
      label: "Cat",
      content: "🐱",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "dog",
      label: "Dog",
      content: "🐶",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "rocket",
      label: "Rocket",
      content: "🚀",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "soccer",
      label: "Soccer",
      content: "⚽",
      style: { backgroundColor: "#FFFFFF" },
    },
  ],
  [ChildPasswordType.PATTERN]: [
    {
      token: "pattern1",
      label: "Pattern 1",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern2",
      label: "Pattern 2",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern3",
      label: "Pattern 3",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern4",
      label: "Pattern 4",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern5",
      label: "Pattern 5",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern6",
      label: "Pattern 6",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern7",
      label: "Pattern 7",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern8",
      label: "Pattern 8",
      style: { backgroundColor: "#FAFAFA" },
    },
    {
      token: "pattern9",
      label: "Pattern 9",
      style: { backgroundColor: "#FAFAFA" },
    },
  ],
};

export const getChildPatternTiles = (
  type: ChildPasswordType,
): ChildPasswordTile[] => {
  const safeType = isPatternChildPasswordType(type)
    ? type
    : ChildPasswordType.COLOR;
  return childPatternTiles[safeType];
};

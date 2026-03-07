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
  | ChildPasswordType.EMOJI;

export const childPatternTiles: Record<
  PatternChildPasswordType,
  ChildPasswordTile[]
> = {
  [ChildPasswordType.COLOR]: [
    { token: "sage", label: "Sage", style: { backgroundColor: "#5D9275" } },
    { token: "salmon", label: "Salmon", style: { backgroundColor: "#E69A92" } },
    {
      token: "blush",
      label: "Blush",
      style: { backgroundColor: "#E1C7C9" },
    },
    {
      token: "mist",
      label: "Mist",
      style: { backgroundColor: "#DFE7E8" },
    },
    { token: "iris", label: "Iris", style: { backgroundColor: "#82559C" } },
    { token: "mint", label: "Mint", style: { backgroundColor: "#C4DDC6" } },
    {
      token: "mustard",
      label: "Mustard",
      style: { backgroundColor: "#DEC945" },
    },
    {
      token: "crimson",
      label: "Crimson",
      style: { backgroundColor: "#C02736" },
    },
    {
      token: "rose",
      label: "Rose",
      style: { backgroundColor: "#CF95A2" },
    },
  ],
  [ChildPasswordType.SHAPE]: [
    {
      token: "circle",
      label: "Circle",
      content: "●",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "square",
      label: "Square",
      content: "■",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "triangle",
      label: "Triangle",
      content: "▲",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "diamond",
      label: "Diamond",
      content: "◆",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "star",
      label: "Star",
      content: "★",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "heart",
      label: "Heart",
      content: "♥",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "club",
      label: "Club",
      content: "♣",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "spade",
      label: "Spade",
      content: "♠",
      style: { backgroundColor: "#FFFFFF" },
    },
    {
      token: "sun",
      label: "Sun",
      content: "☀",
      style: { backgroundColor: "#FFFFFF" },
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
};

export const getChildPatternTiles = (
  type: ChildPasswordType,
): ChildPasswordTile[] => {
  const safeType = isPatternChildPasswordType(type)
    ? type
    : ChildPasswordType.COLOR;
  return childPatternTiles[safeType];
};

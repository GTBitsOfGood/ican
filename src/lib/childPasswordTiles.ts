import { CSSProperties } from "react";

export interface ChildPasswordTile {
  token: string;
  label: string;
  style: CSSProperties;
}

export const childPasswordTiles: ChildPasswordTile[] = [
  { token: "red", label: "Red", style: { backgroundColor: "#e11d48" } },
  { token: "green", label: "Green", style: { backgroundColor: "#39b54a" } },
  { token: "yellow", label: "Yellow", style: { backgroundColor: "#f9df00" } },
  { token: "blue", label: "Blue", style: { backgroundColor: "#1682bf" } },
  { token: "orange", label: "Orange", style: { backgroundColor: "#f0822f" } },
  { token: "purple", label: "Purple", style: { backgroundColor: "#8f23b5" } },
  {
    token: "cyan",
    label: "Cyan",
    style: { backgroundColor: "#47d1d1" },
  },
  {
    token: "pink",
    label: "Pink",
    style: { backgroundColor: "#d92dd9" },
  },
  {
    token: "red_stripes",
    label: "Red Stripes",
    style: {
      backgroundImage:
        "repeating-linear-gradient(45deg,#e11d48,#e11d48 8px,#ffffff 8px,#ffffff 14px)",
    },
  },
  {
    token: "blue_stripes",
    label: "Blue Stripes",
    style: {
      backgroundImage:
        "repeating-linear-gradient(45deg,#1682bf,#1682bf 8px,#ffffff 8px,#ffffff 14px)",
    },
  },
  {
    token: "yellow_stripes",
    label: "Yellow Stripes",
    style: {
      backgroundImage:
        "repeating-linear-gradient(45deg,#f9df00,#f9df00 8px,#1f2937 8px,#1f2937 14px)",
    },
  },
];

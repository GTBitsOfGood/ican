import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function removeUndefinedKeys<T extends object>(obj: T): T {
  if (typeof obj !== "object" || obj === null) {
    throw new TypeError("Expected an object");
  }

  return Object.fromEntries(
    Object.entries(obj).filter((entry) => entry[1] !== undefined),
  ) as T;
}

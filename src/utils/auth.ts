import { InvalidBodyError } from "../types/exceptions";
import { z } from "zod";

export function validateName(name: string) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new InvalidBodyError(
      "Invalid request body: 'name' is required and must be a non-empty string.",
    );
  }
}

export function validateEmail(email: string) {
  const emailSchema = z.string().email();
  if (!emailSchema.safeParse(email).success) {
    throw new InvalidBodyError(
      "Invalid request body: 'email' is required and must be a valid email.",
    );
  }
}

export function validatePassword(password: string) {
  if (
    !(
      password.length >= 6 &&
      /\d/.test(password) &&
      /[!@#$%^&*]/.test(password)
    )
  ) {
    throw new InvalidBodyError(
      "Invalid request body: 'password' must contain at least 6 characters, 1 number, & 1 symbol.",
    );
  }
}

export function passwordsAreEqual(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    throw new InvalidBodyError(
      "Invalid request body: 'password' and 'confirmPassword' must be equal.",
    );
  }
}

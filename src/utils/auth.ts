import { z } from "zod";
import { InvalidArgumentsError, ValidationError } from "@/types/exceptions";

export function validateName(name: string) {
  if (name.trim() === "") {
    throw new InvalidArgumentsError(
      "'name' is required and must be a non-empty string.",
    );
  }
}

export function validateEmail(email: string) {
  const emailSchema = z.string().email();
  if (!emailSchema.safeParse(email).success) {
    throw new InvalidArgumentsError(
      "'email' is required and must be a valid email.",
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
    throw new ValidationError(
      "'password' is required and must be greater than 6 characters and have special characters.",
    );
  }
}

export function passwordsAreEqual(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    throw new ValidationError(
      "'password' and 'confirmPassword' must be equal.",
    );
  }
}

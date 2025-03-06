import {
  ConflictError,
  InvalidArgumentsError,
  ValidationError,
} from "../types/exceptions";
import { z } from "zod";
import ERRORS from "./errorMessages";

export function validateName(name: string) {
  if (typeof name !== "string" || name.trim() === "") {
    throw new InvalidArgumentsError(ERRORS.USER.INVALID_ARGUMENTS.NAME);
  }
}

export function validateEmail(email: string) {
  const emailSchema = z.string().email();
  if (!emailSchema.safeParse(email).success) {
    throw new InvalidArgumentsError(ERRORS.USER.INVALID_ARGUMENTS.EMAIL);
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
    throw new ValidationError(ERRORS.USER.INVALID_ARGUMENTS.PASSWORD);
  }
}

export function passwordsAreEqual(password: string, confirmPassword: string) {
  if (password !== confirmPassword) {
    throw new ConflictError(ERRORS.USER.CONFLICT.PASSWORD);
  }
}

import { CustomError } from "./types/exceptions";

export function validatePassword(password: string, confirmPassword: string) {
  // Assert a password length of greater than 10
  if (password.length <= 10) {
    throw new CustomError(400, "Password must be more than 10 characters.");
  }

  // Check password & confirmPassword
  if (password !== confirmPassword) {
    throw new CustomError(400, "Password does not equal confirm password.");
  }
}

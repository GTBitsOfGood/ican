import { z } from "zod";

export function nameIsValid(name: string) {
  return name.trim() !== "";
}

export function emailIsValid(email: string) {
  const emailSchema = z.string().email();
  return emailSchema.safeParse(email).success;
}

export function passwordIsValid(password: string) {
  return (
    password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password)
  );
}

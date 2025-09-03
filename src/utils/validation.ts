import { z } from "zod";

export const emailValidation = (email: string): boolean => {
  const emailSchema = z.string().email();
  try {
    emailSchema.parse(email);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Must contain at least 6 characters, 1 number, & 1 symbol
export const passwordRequirementsValidation = (password: string): boolean => {
  const numnberRegex = /[0-9]/;
  const specialCharacterRegex = /[`!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~ ]/;
  const passwordSchema = z
    .string()
    .min(6)
    .refine((password) => numnberRegex.test(password))
    .refine((password) => specialCharacterRegex.test(password));
  try {
    passwordSchema.parse(password);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

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

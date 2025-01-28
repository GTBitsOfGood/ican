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

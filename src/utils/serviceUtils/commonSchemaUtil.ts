import { ObjectId } from "mongodb";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(
    6,
    "Invalid request body: 'password' must contain at least 6 characters, 1 number, & 1 symbol.",
  )
  .regex(
    /\d/,
    "Invalid request body: 'password' must contain at least 6 characters, 1 number, & 1 symbol.",
  )
  .regex(
    /[!@#$%^&*]/,
    "Invalid request body: 'password' must contain at least 6 characters, 1 number, & 1 symbol.",
  );

export const emailSchema = z
  .string()
  .email(
    "Invalid request body: 'email' is required and must be a valid email.",
  );

const isValidObjectId = (value: string): boolean => {
  return ObjectId.isValid(value);
};

export const objectIdSchema = z.string().refine(isValidObjectId, {
  message: "Must be a valid ObjectId",
});

// export const userIdSchema = z
//   .string()
//   .trim()
//   .nonempty()

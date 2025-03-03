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

/**
 * ObjectIdSchema is a general schema used to validate a string and check if converting it to an ObjectId is valid,
 * it does not check whether or not the ObjectId exists.
 * @param fieldName The name of the ObjectID displayed by the message
 * @returns An error message if the string is not a valid ObjectId
 */
export const objectIdSchema = (fieldName = "ID") =>
  z.string().refine(isValidObjectId, {
    message: `Invalid ${fieldName}: must be a valid ObjectId`,
  });

// Very basic format validation, actual verification is assigned to services/auth.ts
export const tokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, {
    message: "Invalid JWT format",
  });

/**
 * createValidateFunction simplifies creating basic validation functions by returning a constant that can be used to validate data to a schema
 * @param schema zod-schema that for the validation function
 * @returns validation function that can be used to validate data to a schema
 */
export function createValidateFunction<T extends z.ZodType>(schema: T) {
  return (data: unknown): z.infer<T> => {
    return schema.parse(data);
  };
}

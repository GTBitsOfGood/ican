import { z } from "zod";
import {
  passwordSchema,
  emailSchema,
  tokenSchema,
  createValidateFunction,
  stringSchema,
} from "./commonSchemaUtil";

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .nonempty(
        "Invalid request body: 'name' is required and must be a non-empty string.",
      ),

    email: emailSchema,

    password: passwordSchema,

    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message:
      "Invalid request body: 'password' and 'confirmPassword' must be equal.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: emailSchema,

  password: passwordSchema,
});

export const loginWithGoogleSchema = z.object({
  name: z
    .string()
    .trim()
    .nonempty(
      "Invalid request body: 'name' is required and must be a non-empty string.",
    ),

  email: emailSchema,
});

export const validateTokenSchema = z.object({
  token: tokenSchema,
});

export const validateDeleteSchema = z.object({
  userId: stringSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginWithGoogleInput = z.infer<typeof loginWithGoogleSchema>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;

// Both can be used and are the same
export const validateRegister = createValidateFunction(registerSchema);
export const validateLogin = createValidateFunction(loginSchema);
export const validateLoginWithGoogle = createValidateFunction(
  loginWithGoogleSchema,
);
export const validateTokenInput = createValidateFunction(validateTokenSchema);
export const validateDeleteUser = createValidateFunction(validateDeleteSchema);

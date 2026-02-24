import { z } from "zod";
import {
  emailSchema,
  tokenSchema,
  createValidateFunction,
  stringSchema,
  passwordSchema,
} from "./commonSchemaUtil";
import { ChildPasswordType, LoginType } from "@/types/user";

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
  password: z
    .string()
    .trim()
    .nonempty("Invalid request body: 'password' is required."),
  loginType: z.nativeEnum(LoginType).optional(),
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

export const childPasswordTypeSchema = z.object({
  email: emailSchema,
});

export const updateChildLoginSchema = z.object({
  userId: stringSchema,
  childPassword: z
    .string()
    .trim()
    .min(
      3,
      "Invalid request body: 'childPassword' is required and must be at least 3 characters.",
    ),
  childPasswordType: z.nativeEnum(ChildPasswordType),
});

export const validateDeleteSchema = z.object({
  userId: stringSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginWithGoogleInput = z.infer<typeof loginWithGoogleSchema>;
export type ValidateTokenInput = z.infer<typeof validateTokenSchema>;
export type ChildPasswordTypeInput = z.infer<typeof childPasswordTypeSchema>;
export type UpdateChildLoginInput = z.infer<typeof updateChildLoginSchema>;

// Both can be used and are the same
export const validateRegister = createValidateFunction(registerSchema);
export const validateLogin = createValidateFunction(loginSchema);
export const validateLoginWithGoogle = createValidateFunction(
  loginWithGoogleSchema,
);
export const validateTokenInput = createValidateFunction(validateTokenSchema);
export const validateDeleteUser = createValidateFunction(validateDeleteSchema);
export const validateChildPasswordType = createValidateFunction(
  childPasswordTypeSchema,
);
export const validateUpdateChildLogin = createValidateFunction(
  updateChildLoginSchema,
);

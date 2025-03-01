import { z } from "zod";
import { passwordSchema, emailSchema } from "./commonSchemaUtil";

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

    confirmPassword: z.string(),
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

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type LoginWithGoogleInput = z.infer<typeof loginWithGoogleSchema>;

export const validateRegister = (data: unknown): RegisterInput => {
  return registerSchema.parse(data);
};

export const validateLogin = (data: unknown): LoginInput => {
  return loginSchema.parse(data);
};

export const validateLoginWithGoogle = (
  data: unknown,
): LoginWithGoogleInput => {
  return loginWithGoogleSchema.parse(data);
};

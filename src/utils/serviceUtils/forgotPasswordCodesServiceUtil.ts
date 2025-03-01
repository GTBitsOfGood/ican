import { z } from "zod";
import { emailSchema, passwordSchema } from "./commonSchemaUtil";

export const sendPasswordCodeSchema = z.object({
  email: emailSchema,
});

export const verifyForgotPasswordCodeSchema = z.object({
  userId: z.string().trim().nonempty(),

  code: z.string(),
});

export const changePasswordSchema = z
  .object({
    token: z.string(),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message:
      "Invalid request body: 'password' and 'confirmPassword' must be equal.",
    path: ["confirmPassword"],
  });

export type SendPasswordCodeInput = z.infer<typeof sendPasswordCodeSchema>;
export type VerifyForgotPasswordCodeInput = z.infer<
  typeof verifyForgotPasswordCodeSchema
>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const validateSendPasswordCode = (
  data: unknown,
): SendPasswordCodeInput => {
  return sendPasswordCodeSchema.parse(data);
};

export const validateVerifyForgotPasswordCode = (
  data: unknown,
): VerifyForgotPasswordCodeInput => {
  return verifyForgotPasswordCodeSchema.parse(data);
};

export const validateChangePassword = (data: unknown): ChangePasswordInput => {
  return changePasswordSchema.parse(data);
};

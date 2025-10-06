import { z } from "zod";
import {
  emailSchema,
  objectIdSchema,
  passwordSchema,
} from "./commonSchemaUtil";

export const sendPasswordCodeSchema = z
  .object({
    email: emailSchema.optional(),
    userId: objectIdSchema("UserId").optional(),
  })
  .refine((data) => data.email || data.userId, {
    message: "Either email or userId must be provided",
  });

export const verifyForgotPasswordCodeSchema = z.object({
  userId: z.string().trim().nonempty(),

  code: z.string().regex(/^\d+$/, {
    message: "Code must contain only numbers",
  }),
});

export const changePasswordSchema = z
  .object({
    userId: objectIdSchema("userId"),
    newPassword: passwordSchema,
    confirmPassword: passwordSchema,
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

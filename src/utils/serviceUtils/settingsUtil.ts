import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";

export const createSettingsSchema = z.object({
  userId: objectIdSchema("UserId"),
});

export const getSettingsSchema = z.object({ userId: objectIdSchema("UserId") });

const notificationPreferencesSchema = z
  .object({
    types: z
      .array(z.enum(["early", "on_time", "missed"]))
      .min(1)
      .optional(),
    earlyWindow: z.number().min(1).max(120).optional(),
    emailEnabled: z.boolean().optional(),
    realTimeEnabled: z.boolean().optional(),
  })
  .optional();

export const updateSettingsSchema = z.object({
  userId: objectIdSchema("UserId"),
  notifications: z.boolean().optional(),
  helpfulTips: z.boolean().optional(),
  largeFontSize: z.boolean().optional(),
  notificationPreferences: notificationPreferencesSchema,
});

export const updatePinSchema = z.object({
  userId: objectIdSchema("UserId"),
  pin: z
    .string()
    .length(4, "Pin can only be of length 4")
    .regex(/^\d+$/, "Pin must be only numerical")
    .nullable(),
});

export type CreateSettingsInput = z.infer<typeof createSettingsSchema>;
export type GetSettingsInput = z.infer<typeof getSettingsSchema>;
export type UpdateSettingsInput = z.infer<typeof updateSettingsSchema>;
export type UpdatePinInput = z.infer<typeof updatePinSchema>;

// These functions might fare better as a static function inside a class?
export const validateCreateSettings = (data: unknown): CreateSettingsInput => {
  return createSettingsSchema.parse(data);
};

export const validateGetSettings = (data: unknown): GetSettingsInput => {
  return getSettingsSchema.parse(data);
};

export const validateUpdateSettings = (data: unknown): UpdateSettingsInput => {
  return updateSettingsSchema.parse(data);
};

export const validateUpdatePin = (data: unknown): UpdatePinInput => {
  return updatePinSchema.parse(data);
};

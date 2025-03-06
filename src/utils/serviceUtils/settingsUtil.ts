import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";

export const createSettingsSchema = z.object({
  userId: objectIdSchema("UserId"),
});

export const getSettingsSchema = z.object({ userId: objectIdSchema("UserId") });

export const updateSettingsSchema = z.object({
  userId: objectIdSchema("UserId"),

  parentalControl: z.boolean().optional(),

  notifications: z.boolean().optional(),

  helpfulTips: z.boolean().optional(),

  largeFontSize: z.boolean().optional(),
});

export const updatePinSchema = z.object({
  userId: objectIdSchema("UserId"),

  pin: z
    .string()
    .length(4, "Pin can only be of length 4")
    .regex(/^\d+$/, "Pin must be only numerical"),
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

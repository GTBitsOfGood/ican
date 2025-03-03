import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";

export const createMedicationSchema = z.object({
  formOfMedication: z.string().nonempty("Form of medication is required"),

  medicationId: z
    .string()
    .nonempty("Medication ID is required")
    .max(5, "Medication ID must be less than 6 characters"),

  repeatInterval: z
    .number()
    .positive("Repeat interval must be a positive nonzero number"),

  repeatUnit: z.string().nonempty("Repeat unit is required"),

  repeatOn: z.array(z.string()).nonempty("Repeat on must be a non-empty array"),

  repeatMonthlyOnDay: z
    .number()
    .positive("Repeat monthly on day must be positive"),

  notificationFrequency: z
    .string()
    .nonempty("Notification frequency is required"),

  dosesPerDay: z
    .number()
    .positive("Doses per day must be a positive nonzero number"),

  doseIntervalInHours: z
    .number()
    .positive("Dose interval in hours must be a positive nonzero number"),

  doseTimes: z
    .array(z.string())
    .nonempty("Dose times must be a non-empty array"),

  userId: objectIdSchema("UserId"),
});

const updateMedicationSchema = z.object({
  id: objectIdSchema("medicationId").optional(),

  formOfMedication: z
    .string()
    .min(1, "Form of medication must be a non-empty string")
    .optional(),

  medicationId: z
    .string()
    .min(1, "Medication ID must be a non-empty string")
    .max(5, "Medication ID must be less than 6 characters")
    .optional(),

  repeatInterval: z
    .number()
    .positive("Repeat interval must be a positive nonzero number")
    .optional(),

  repeatUnit: z
    .string()
    .min(1, "Repeat unit must be a non-empty string")
    .optional(),

  repeatOn: z
    .array(z.string())
    .min(1, "Repeat on must be a non-empty array")
    .optional(),

  repeatMonthlyOnDay: z
    .number()
    .positive("Repeat monthly on day must be positive")
    .optional(),

  notificationFrequency: z
    .string()
    .min(1, "Notification frequency must be a non-empty string")
    .optional(),

  dosesPerDay: z
    .number()
    .positive("Doses per day must be a positive nonzero number")
    .optional(),

  doseIntervalInHours: z
    .number()
    .positive("Dose interval in hours must be a positive nonzero number")
    .optional(),

  doseTimes: z
    .array(z.string())
    .min(1, "Dose times must be a non-empty array")
    .optional(),

  notes: z.string().optional(),

  userId: objectIdSchema("userId").optional(),
});

export const getMedicationSchema = z.object({
  id: objectIdSchema("medicationId"),
});
export const deleteMedicationSchema = z.object({
  id: objectIdSchema("medicationId"),
});
export const getMedicationsSchema = z.object({
  userId: objectIdSchema("userId"),
});

export type CreateMedication = z.infer<typeof createMedicationSchema>;
export type GetMedication = z.infer<typeof getMedicationSchema>;
export type GetMedications = z.infer<typeof getMedicationsSchema>;
export type DeleteMedication = z.infer<typeof deleteMedicationSchema>;
export type UpdateMedication = z.infer<typeof updateMedicationSchema>;

export const validateCreateMedication = (data: unknown): CreateMedication => {
  return createMedicationSchema.parse(data);
};

export const validateGetMedication = (data: unknown): GetMedication => {
  return getMedicationSchema.parse(data);
};

export const validateDeleteMedication = (data: unknown): DeleteMedication => {
  return deleteMedicationSchema.parse(data);
};

export const validateUpdateMedication = (data: unknown): UpdateMedication => {
  return updateMedicationSchema.parse(data);
};

export const validateGetMedications = (data: unknown): GetMedications => {
  return getMedicationsSchema.parse(data);
};

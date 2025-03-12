import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";
import ERRORS from "../errorMessages";

export const baseMedicationSchema = z.object({
  formOfMedication: z.enum(["tablet", "liquid", "injection"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.FORM_OF_MEDICATION,
    }),
  }),

  medicationId: z
    .string()
    .nonempty(ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID)
    .max(5, ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID),

  repeatUnit: z.enum(["day", "week", "month"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_UNIT,
    }),
  }),

  repeatInterval: z
    .number()
    .positive(ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_INTERVAL),

  repeatWeeklyOn: z
    .array(
      z.enum([
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ]),
    )
    .optional(),

  repeatMonthlyType: z.enum(["day", "week"]).optional(),

  repeatMonthlyOnDay: z
    .number()
    .positive(ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_MONTHLY_ON_DAY)
    .optional(),

  repeatMonthlyOnWeek: z
    .number()
    .min(1, ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_MONTHLY_ON_WEEK)
    .max(4, ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_MONTHLY_ON_WEEK)
    .optional(),

  repeatMonthlyOnWeekDay: z
    .enum([
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ])
    .optional(),

  dosesUnit: z.enum(["doses", "hours"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSES_UNIT,
    }),
  }),

  dosesPerDay: z
    .number()
    .positive(ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSES_PER_DAY)
    .optional(),

  doseIntervalInHours: z
    .number()
    .positive(ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSE_INTERVAL_IN_HOURS)
    .optional(),

  dosageAmount: z
    .string()
    .nonempty(ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSAGE_AMOUNT),

  doseTimes: z.array(z.string()),

  notificationFrequency: z.enum(["day of dose", "every dose"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.NOTIFICATION_FREQUENCY,
    }),
  }),

  notes: z.string().optional(),
});

const medicationRefine = (
  data: z.infer<typeof baseMedicationSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.repeatUnit === "week" && !data.repeatWeeklyOn) {
    ctx.addIssue({
      path: ["repeatWeeklyOn"],
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_WEEKLY_ON,
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "month" &&
    !data.repeatMonthlyOnDay &&
    (!data.repeatMonthlyOnWeekDay || !data.repeatMonthlyOnWeek)
  ) {
    ctx.addIssue({
      path: [
        "repeatMonthlyOnDay",
        "repeatMonthlyOnDayOfWeek",
        "repeatMonthlyOnWeekOfMonth",
      ],
      message:
        "If the repeat unit is in months, at least either repeatMonthlyOnDay or repeatMonthlyOnDayOfWeek and repeatMonthlyOnWeekOfMonth must be provided.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "month" &&
    data.repeatMonthlyType === "week" &&
    (!data.repeatMonthlyOnWeekDay || !data.repeatMonthlyOnWeek)
  ) {
    ctx.addIssue({
      path: [
        "repeatUnit",
        "repeatMonthlyType",
        "repeatMonthlyOnWeek",
        "repeatMonthlyOnWeekDay",
      ],
      message:
        "RepeatMonthlyOnWeek and RepeatMonthlyOnWeekDay must be provided if RepeatUnit is 'month' and RepeatMonthlyType is 'week'.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "month" &&
    data.repeatMonthlyType === "day" &&
    !data.repeatMonthlyOnDay
  ) {
    ctx.addIssue({
      path: ["repeatUnit", "repeatMonthlyType", "repeatMonthlyOnDay"],
      message:
        "RepeatMonthlyOnDay must be provided if RepeatUnit is 'month' and RepeatMonthlyType is 'day'.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (!data.dosesPerDay && !data.doseIntervalInHours) {
    ctx.addIssue({
      path: ["dosesPerDay", "doseIntervalInHours"],
      message: "Either DosesPerDay or DoseIntervalInHours must be provided.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.dosesUnit === "hours" && data.doseTimes.length === 0) {
    ctx.addIssue({
      path: ["dosesUnit", "doseTimes"],
      message:
        "DoseTimes needs to be a non-empty array if DosesUnit is 'hours'.",
      code: z.ZodIssueCode.custom,
    });
  }
};

const createMedicationSchema = baseMedicationSchema
  .extend({
    userId: objectIdSchema("UserId"),
  })
  .superRefine(medicationRefine);

export const updateMedicationSchema = baseMedicationSchema
  .extend({
    userId: objectIdSchema("UserId").optional(),
  })
  .superRefine(medicationRefine);

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

import { z } from "zod";
import { objectIdSchema } from "./commonSchemaUtil";
import ERRORS from "../errorMessages";
import { Medication } from "@/db/models/medication";
import { DAYS_OF_WEEK } from "@/lib/consts";
import { MedicationLogDocument } from "@/db/models/medicationLog";
import { WithId } from "@/types/models";

function isValidTimeString(value: string): boolean {
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return timeRegex.test(value);
}

function convertTimeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + minutes;
}

export const baseMedicationSchema = z.object({
  formOfMedication: z.enum(["Pill", "Syrup", "Shot"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.FORM_OF_MEDICATION,
    }),
  }),

  customMedicationId: z
    .string()
    .nonempty(ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID)
    .max(5, ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID),

  repeatUnit: z.enum(["Day", "Week", "Month"], {
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

  repeatMonthlyType: z.enum(["Day", "Week"]).optional(),

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

  dosesUnit: z.enum(["Doses", "Hours"], {
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

  notificationFrequency: z.enum(["Day Of Dose", "Every Dose"], {
    errorMap: () => ({
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.NOTIFICATION_FREQUENCY,
    }),
  }),

  includeTimes: z.boolean(),
  notes: z.string().optional(),
});

const medicationRefine = (
  data: z.infer<typeof baseMedicationSchema>,
  ctx: z.RefinementCtx,
) => {
  if (data.repeatUnit === "Week" && !data.repeatWeeklyOn) {
    ctx.addIssue({
      path: ["repeatWeeklyOn"],
      message: ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_WEEKLY_ON,
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "Month" &&
    !data.repeatMonthlyOnDay &&
    (!data.repeatMonthlyOnWeekDay || !data.repeatMonthlyOnWeek)
  ) {
    ctx.addIssue({
      path: [
        "repeatMonthlyOnDay",
        "repeatMonthlyOnWeekDay",
        "repeatMonthlyOnWeek",
      ],
      message:
        "If the repeat unit is 'Month', at least either repeatMonthlyOnDay or repeatMonthlyOnWeekDay and repeatMonthlyOnWeek must be provided.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "Month" &&
    data.repeatMonthlyType === "Week" &&
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
        "repeatMonthlyOnWeek and repeatMonthlyOnWeekDay must be provided if repeatUnit is 'Month' and repeatMonthlyType is 'Week'.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (
    data.repeatUnit === "Month" &&
    data.repeatMonthlyType === "Day" &&
    !data.repeatMonthlyOnDay
  ) {
    ctx.addIssue({
      path: ["repeatUnit", "repeatMonthlyType", "repeatMonthlyOnDay"],
      message:
        "repeatMonthlyOnDay must be provided if repeatUnit is 'Month' and repeatMonthlyType is 'Day'.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (!data.dosesPerDay && !data.doseIntervalInHours) {
    ctx.addIssue({
      path: ["dosesPerDay", "doseIntervalInHours"],
      message: "Either dosesPerDay or doseIntervalInHours must be provided.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.includeTimes && data.doseTimes.length === 0) {
    ctx.addIssue({
      path: ["includeTimes", "doseTimes"],
      message:
        "doseTimes needs to be a non-empty array if includeTimes is true.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (!data.includeTimes && data.doseTimes.length > 0) {
    ctx.addIssue({
      path: ["includeTimes", "doseTimes"],
      message: "doseTimes must be empty if includeTimes is false.",
      code: z.ZodIssueCode.custom,
    });
  }

  if (data.includeTimes && data.doseTimes.length > 0) {
    const uniqueTimes = new Set();
    for (let i = 0; i < data.doseTimes.length; i++) {
      if (!isValidTimeString(data.doseTimes[i])) {
        ctx.addIssue({
          path: ["doseTimes", i],
          message: "At least one of your times is not in the HH:MM format.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (uniqueTimes.has(data.doseTimes[i])) {
        ctx.addIssue({
          path: ["doseTimes", i],
          message: "Duplicate times are not allowed.",
          code: z.ZodIssueCode.custom,
        });
      }
      uniqueTimes.add(data.doseTimes[i]);

      if (i > 0) {
        const prevTimeInMinutes = convertTimeToMinutes(data.doseTimes[i - 1]);
        const currTimeInMinutes = convertTimeToMinutes(data.doseTimes[i]);

        if (currTimeInMinutes <= prevTimeInMinutes) {
          ctx.addIssue({
            path: ["doseTimes", i],
            message: "The times are not in chronological order.",
            code: z.ZodIssueCode.custom,
          });
        }
      }
    }
  }
};

const createMedicationSchema = baseMedicationSchema
  .extend({
    userId: objectIdSchema("UserId"),
  })
  .superRefine(medicationRefine);

export const updateMedicationSchema =
  baseMedicationSchema.superRefine(medicationRefine);

export const getMedicationSchema = z.object({
  id: objectIdSchema("medicationId"),
});
export const deleteMedicationSchema = z.object({
  id: objectIdSchema("medicationId"),
});
export const getMedicationsSchema = z.object({
  userId: objectIdSchema("userId"),
});
export const getMedicationsScheduleSchema = z.object({
  userId: objectIdSchema("userId"),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD expected)"),
});

export type CreateMedication = z.infer<typeof createMedicationSchema>;
export type GetMedication = z.infer<typeof getMedicationSchema>;
export type GetMedications = z.infer<typeof getMedicationsSchema>;
export type GetMedicationsSchedule = z.infer<
  typeof getMedicationsScheduleSchema
>;
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

export const validateGetMedicationsSchedule = (
  data: unknown,
): GetMedicationsSchedule => {
  return getMedicationsScheduleSchema.parse(data);
};

export function shouldScheduleMedication(
  medication: WithId<Medication>,
  givenDate: Date,
  medicationCreated: Date,
): boolean {
  const givenDateTime = givenDate.getTime();
  const medicationCreatedDateTime = medicationCreated.getTime();

  if (givenDateTime < medicationCreatedDateTime) {
    return false;
  }

  if (medication.repeatUnit === "Day") {
    const daysApart = Math.ceil(
      (givenDateTime - medicationCreatedDateTime) / (1000 * 60 * 60 * 24),
    );
    return daysApart % (medication.repeatInterval ?? 1) === 0;
  } else if (medication.repeatUnit === "Week") {
    const givenDayOfWeek = DAYS_OF_WEEK[givenDate.getUTCDay()];
    const isDayScheduled =
      medication.repeatWeeklyOn &&
      medication.repeatWeeklyOn.includes(givenDayOfWeek);

    if (!isDayScheduled) {
      return false;
    }

    const normalizeToStartOfWeek = (date: Date): Date => {
      const result = new Date(date);
      const day = result.getUTCDay();
      result.setUTCDate(result.getUTCDate() - day);
      result.setUTCHours(0, 0, 0, 0);
      return result;
    };

    const lastTakenWeekStart = normalizeToStartOfWeek(
      medicationCreated as Date,
    );
    const givenDateWeekStart = normalizeToStartOfWeek(givenDate);
    const weeksApart = Math.floor(
      (givenDateWeekStart.getTime() - lastTakenWeekStart.getTime()) /
        (1000 * 60 * 60 * 24 * 7),
    );
    return weeksApart % (medication.repeatInterval ?? 1) === 0;
  } else if (medication.repeatUnit === "Month") {
    if (medication.repeatMonthlyType === "Day") {
      const scheduledDayOfMonth = medication.repeatMonthlyOnDay;
      const givenDayOfMonth = givenDate.getUTCDate();

      if (givenDayOfMonth === scheduledDayOfMonth) {
        const lastTakenMonth = medicationCreated
          ? medicationCreated.getUTCMonth()
          : 0;
        const lastTakenYear = medicationCreated
          ? medicationCreated.getUTCFullYear()
          : 0;
        const givenMonth = givenDate.getUTCMonth();
        const givenYear = givenDate.getUTCFullYear();

        const monthsApart =
          (givenYear - lastTakenYear) * 12 + (givenMonth - lastTakenMonth);

        return monthsApart % (medication.repeatInterval ?? 1) === 0;
      }
    } else if (medication.repeatMonthlyType === "Week") {
      const scheduledWeekOfMonth = medication.repeatMonthlyOnWeek;
      const scheduledDayOfWeek = medication.repeatMonthlyOnWeekDay;

      const givenDayOfWeek = DAYS_OF_WEEK[givenDate.getUTCDay()];
      const givenDayOfMonth = givenDate.getUTCDate();

      let weekOfMonth = Math.ceil(givenDayOfMonth / 7);

      if (scheduledWeekOfMonth === 5) {
        const lastDayOfMonth = new Date(
          givenDate.getUTCFullYear(),
          givenDate.getUTCMonth() + 1,
          0,
        );
        const daysUntilEndOfMonth =
          lastDayOfMonth.getUTCDate() - givenDayOfMonth;

        if (daysUntilEndOfMonth < 7) {
          weekOfMonth = 5;
        }
      }

      if (
        givenDayOfWeek === scheduledDayOfWeek &&
        weekOfMonth === scheduledWeekOfMonth
      ) {
        const lastTakenMonth = medicationCreated
          ? medicationCreated.getUTCMonth()
          : 0;
        const lastTakenYear = medicationCreated
          ? medicationCreated.getUTCFullYear()
          : 0;
        const givenMonth = givenDate.getUTCMonth();
        const givenYear = givenDate.getUTCFullYear();

        const monthsApart =
          (givenYear - lastTakenYear) * 12 + (givenMonth - lastTakenMonth);
        return monthsApart % (medication.repeatInterval ?? 1) === 0;
      }
    }
  }

  return false;
}

export function processDoseTime(
  time: string,
  date: string,
  medicationLogs: MedicationLogDocument[],
  localTime: string,
) {
  const [hours, minutes] = time.split(":").map(Number);
  let status: "pending" | "taken" | "missed" = "pending";
  let canCheckIn = false;

  const doseTime = new Date(date);

  const offsetMinutes = doseTime.getTimezoneOffset();
  const utcHour = hours + Math.floor((minutes + offsetMinutes) / 60);
  const utcMinute = (minutes + offsetMinutes) % 60;

  doseTime.setUTCHours(utcHour, utcMinute, 0, 0);

  const matchingLog = medicationLogs.find((log) => {
    const logDate = new Date(log.dateTaken);
    return Math.abs(logDate.getTime() - doseTime.getTime()) <= 15 * 60 * 1000;
  });

  if (matchingLog) {
    status = "taken";
  } else {
    const now = new Date(localTime);
    const currentDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );
    currentDate.setUTCHours(0, 0, 0, 0);

    const givenDate = new Date(date);

    if (currentDate.getTime() === givenDate.getTime()) {
      canCheckIn =
        Math.abs(now.getTime() - doseTime.getTime()) <= 15 * 60 * 1000;
    }

    if (now.getTime() - doseTime.getTime() >= 15 * 60 * 1000) {
      status = "missed";
    }
  }

  return {
    status,
    canCheckIn,
  };
}

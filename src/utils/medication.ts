import { Types } from "mongoose";
import { InvalidArgumentsError } from "../types/exceptions";
import ERRORS from "./errorMessages";

type ValidateParamsType = {
  id?: string;
  formOfMedication?: string;
  medicationId?: string;
  repeatInterval?: number;
  repeatUnit?: string;
  repeatOn?: string[];
  repeatMonthlyOnDay?: number;
  notificationFrequency?: string;
  dosesPerDay?: number;
  doseIntervalInHours?: number;
  // string of times
  doseTimes?: string[];
  userId?: string | Types.ObjectId;
};

export async function validateCreateParams({
  formOfMedication,
  medicationId,
  repeatInterval,
  repeatUnit,
  repeatOn,
  repeatMonthlyOnDay,
  notificationFrequency,
  dosesPerDay,
  doseIntervalInHours,
  doseTimes,
  userId,
}: ValidateParamsType): Promise<void> {
  // Ensure required parameters are not nullish
  if (!formOfMedication) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.FORM_OF_MEDICATION,
    );
  }
  if (!medicationId) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID,
    );
  }
  if (repeatInterval == null) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_INTERVAL,
    );
  }
  if (!repeatUnit) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_UNIT,
    );
  }
  if (repeatOn == null) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_ON,
    );
  }
  if (repeatMonthlyOnDay == null) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_MONTHLY_ON_DAY,
    );
  }
  if (!notificationFrequency) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.NOTIFICATION_FREQUENCY,
    );
  }
  if (dosesPerDay == null) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSES_PER_DAY,
    );
  }
  if (doseIntervalInHours == null) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSE_INTERVAL_IN_HOURS,
    );
  }
  if (doseTimes == null || doseTimes.length === 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSE_TIMES,
    );
  }
  if (!userId) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.USER_ID,
    );
  }

  validateParams({
    formOfMedication,
    medicationId,
    repeatInterval,
    repeatUnit,
    repeatOn,
    repeatMonthlyOnDay,
    notificationFrequency,
    dosesPerDay,
    doseIntervalInHours,
    doseTimes,
    userId,
  });
}

export async function validateParams({
  id,
  formOfMedication,
  medicationId,
  repeatInterval,
  repeatUnit,
  repeatOn,
  repeatMonthlyOnDay,
  notificationFrequency,
  dosesPerDay,
  doseIntervalInHours,
  // string of times
  doseTimes,
  userId,
}: ValidateParamsType): Promise<void> {
  // Validate parameters
  if (id && !Types.ObjectId.isValid(id)) {
    throw new InvalidArgumentsError(ERRORS.MEDICATION.INVALID_ARGUMENTS.ID);
  }

  // Validate formOfMedication only if its passed in
  if (formOfMedication && formOfMedication.trim() === "") {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.FORM_OF_MEDICATION,
    );
  }
  if (
    medicationId &&
    (typeof medicationId !== "string" ||
      medicationId.trim() === "" ||
      medicationId.length > 5)
  ) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.MEDICATION_ID,
    );
  }

  if (repeatInterval && repeatInterval <= 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_INTERVAL,
    );
  }
  if (repeatUnit && repeatUnit.trim() === "") {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_UNIT,
    );
  }

  if (repeatOn && repeatOn.length === 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_ON,
    );
  }
  if (repeatMonthlyOnDay && repeatMonthlyOnDay <= 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.REPEAT_MONTHLY_ON_DAY,
    );
  }
  if (notificationFrequency && notificationFrequency.trim() === "") {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.NOTIFICATION_FREQUENCY,
    );
  }
  if (dosesPerDay && dosesPerDay <= 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSES_PER_DAY,
    );
  }
  if (doseIntervalInHours && doseIntervalInHours <= 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSE_INTERVAL_IN_HOURS,
    );
  }

  if (doseTimes && doseTimes.length === 0) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.DOSE_TIMES,
    );
  }

  if (userId && !Types.ObjectId.isValid(userId)) {
    throw new InvalidArgumentsError(
      ERRORS.MEDICATION.INVALID_ARGUMENTS.USER_ID,
    );
  }
}

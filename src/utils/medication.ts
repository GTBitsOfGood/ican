import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

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
  userId?: string;
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
    throw new InvalidBodyError(
      "Invalid parameters: 'formOfMedication' is required.",
    );
  }
  if (!medicationId) {
    throw new InvalidBodyError(
      "Invalid parameters: 'medicationId' is required.",
    );
  }
  if (repeatInterval == null) {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatInterval' is required.",
    );
  }
  if (!repeatUnit) {
    throw new InvalidBodyError("Invalid parameters: 'repeatUnit' is required.");
  }
  if (repeatOn == null) {
    throw new InvalidBodyError("Invalid parameters: 'repeatOn' is required.");
  }
  if (repeatMonthlyOnDay == null) {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatMonthlyOnDay' is required.",
    );
  }
  if (!notificationFrequency) {
    throw new InvalidBodyError(
      "Invalid parameters: 'notificationFrequency' is required.",
    );
  }
  if (dosesPerDay == null) {
    throw new InvalidBodyError(
      "Invalid parameters: 'dosesPerDay' is required.",
    );
  }
  if (doseIntervalInHours == null) {
    throw new InvalidBodyError(
      "Invalid parameters: 'doseIntervalInHours' is required.",
    );
  }
  if (doseTimes == null || doseTimes.length === 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'doseTimes' is required and must be a non-empty array.",
    );
  }
  if (!userId) {
    throw new InvalidBodyError("Invalid parameters: 'userId' is required.");
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
  if (id && !ObjectId.isValid(id)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'id' is required and must be a valid ObjectId.",
    );
  }

  // Validate formOfMedication only if its passed in
  if (formOfMedication && formOfMedication.trim() === "") {
    throw new InvalidBodyError(
      "Invalid parameters: 'formOfMedication' is required and must be a non-empty string that has a length less than 6.",
    );
  }
  if (
    medicationId &&
    (typeof medicationId !== "string" ||
      medicationId.trim() === "" ||
      medicationId.length > 5)
  ) {
    throw new InvalidBodyError(
      "Invalid parameters: 'medicationId' is required and must be a non-empty string that has a length less than 6.",
    );
  }

  if (repeatInterval && repeatInterval <= 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatInterval' is required and must be a positive nonzero number.",
    );
  }
  if (repeatUnit && repeatUnit.trim() === "") {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatUnit' is required and must be a non-empty string.",
    );
  }

  if (repeatOn && repeatOn.length === 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatOn' is required and must be a non-empty array.",
    );
  }
  if (repeatMonthlyOnDay && repeatMonthlyOnDay <= 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'repeatMonthlyOnDay' is required and must be positive.",
    );
  }
  if (notificationFrequency && notificationFrequency.trim() === "") {
    throw new InvalidBodyError(
      "Invalid parameters: 'notificationFrequency' is required and must be a non-empty string.",
    );
  }
  if (dosesPerDay && dosesPerDay <= 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'dosesPerDay' is required and must be a non-empty string.",
    );
  }
  if (doseIntervalInHours && doseIntervalInHours <= 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'doseIntervalInHours' is required and must be a non-empty string.",
    );
  }

  if (doseTimes && doseTimes.length === 0) {
    throw new InvalidBodyError(
      "Invalid parameters: 'doseTimes' is required and must be a non-empty array.",
    );
  }

  if (userId && !ObjectId.isValid(userId)) {
    throw new InvalidBodyError(
      "Invalid parameters: 'userId' is required and must be a valid ObjectId.",
    );
  }
}

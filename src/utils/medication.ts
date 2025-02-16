import { InvalidBodyError } from "../types/exceptions";
import { ObjectId } from "mongodb";

type ValidateParamsType = {
  id?: string;
  formOfMedication?: string;
  medicationId?: string;
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

export async function validateParams({
  id,
  formOfMedication,
  medicationId,
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
  if (
    formOfMedication &&
    (formOfMedication.trim() === "" || formOfMedication.length > 5)
  ) {
    throw new InvalidBodyError(
      "Invalid parameters: 'formOfMedication' is required and must be a non-empty string that has a length less than 6.",
    );
  }
  if (medicationId && medicationId.trim() === "") {
    throw new InvalidBodyError(
      "Invalid parameters: 'medicationId' is required and must be a non-empty string.",
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

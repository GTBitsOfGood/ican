import { AddMedicationInfo } from "@/components/modals/addMedication/addMedicationInfo";
import { CreateMedicationRequestBody } from "@/types/medication";
import fetchService from "./fetchService";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const medicationService = {
  createMedication: async (
    userId: string,
    medicationInfo: AddMedicationInfo,
  ) => {
    let repeatOnValue: string[] = [];

    switch (medicationInfo.repetition.monthlyRepetition) {
      // Will swap over to a single if statement if repetition has been overly complicated...
      case "Day":
        break;
      case "Week":
        repeatOnValue = medicationInfo.repetition.weeklyRepetition.map(
          (dayIndex) => DAYS_OF_WEEK[dayIndex],
        );
      default:
        break;
    }

    const createMedicationBody: CreateMedicationRequestBody = {
      userId,
      formOfMedication: medicationInfo.general.form,
      medicationId: medicationInfo.general.medicationId,
      repeatInterval: medicationInfo.repetition.repeatEvery || 0,
      repeatUnit: medicationInfo.repetition.type,
      repeatOn: repeatOnValue,

      repeatMonthlyOnDay: medicationInfo.repetition.monthlyDayOfRepetition || 0,

      notificationFrequency: medicationInfo.dosage.notificationFrequency,
      dosesPerDay: medicationInfo.dosage.dosesPerDay || 0,
      doseIntervalInHours: medicationInfo.dosage.hourlyInterval || 0,

      doseTimes: medicationInfo.times,
    };

    return await fetchService("/medication", {
      method: "POST",
      body: JSON.stringify(createMedicationBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

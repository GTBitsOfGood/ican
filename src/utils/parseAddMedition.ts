import { AddMedicationInfo } from "@/components/modals/addMedication/addMedicationInfo";
import { MedicationInfo } from "@/types/medication";

const DAYS_OF_WEEK = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

/**
 * Parses the medication information from type AddMedicationInfo to MedicationInfo, a valid body for API requests to medication
 * @param medicationInfo Medication data provided by '/add-new-medication' route form
 * @returns Object of type MedicationInfo
 */
export const parseAddMedication = (
  medicationInfo: AddMedicationInfo,
): MedicationInfo => {
  // (!) Currently backend does not support notes, so it isn't added here.

  let repeatOnValue: string[] = [];
  let repeatMonthlyOnDay = 0; // Default value

  const repetition = medicationInfo.repetition;
  if (repetition.type == "Day(s)") {
    // Nothing particular to set here for now
    repeatOnValue.push(`Repeat every ${repetition.repeatEvery} day(s)`); // Temporarily here so we don't run into an error with backend validation
  } else if (repetition.type == "Week(s)") {
    repeatOnValue = repetition.weeklyRepetition.map(
      (dayIndex) => DAYS_OF_WEEK[dayIndex],
    );
  } else if (repetition.type == "Month(s)") {
    if (repetition.monthlyRepetition == "Day") {
      if (!repetition.monthlyDayOfRepetition)
        throw Error("Repittion day must for specified for monthly");
      repetition.repeatEvery = 1; // Since we are repeating monthly
      repeatMonthlyOnDay = repetition.monthlyDayOfRepetition;
    } else if (repetition.monthlyRepetition == "Week") {
      // repititon.repeatEvery represents every n months you:
      repeatOnValue.push(
        `${repetition.monthlyWeekOfRepetition} of ${repetition.monthlyWeekDayOfRepetition}`,
      );
    } else {
      throw Error(
        `If monthly repitition is selected, it must be either by "Day" or "Week"`,
      );
    }
  } else {
    throw Error(`Can can only be: "Day(s)", "Week(s)", "Month(s)";`);
  }

  if (medicationInfo.dosage.type == "Doses") {
    if (!medicationInfo.dosage.dosesPerDay)
      throw new Error(`Please specify the dosage per day`);
    medicationInfo.dosage.hourlyInterval = 0; // Or make it null and have backend accept null values
  } else if (medicationInfo.dosage.type == "Hours") {
    if (!medicationInfo.dosage.hourlyInterval)
      throw new Error(`Please specify an hourly interval`);
    medicationInfo.times.splice(1); // Only first element is kept
    medicationInfo.dosage.dosesPerDay = 0; // Unless we calculate it this would not make any sense, so potentially have backend take null
  } else {
    throw new Error(`Please enter check a valid dosage technique`);
  }

  if (!repetition.repeatEvery) throw Error(`Please enter a repeat interval`);

  const medicationBody: MedicationInfo = {
    formOfMedication: medicationInfo.general.form,
    medicationId: medicationInfo.general.medicationId,

    // Repetition
    repeatInterval: repetition.repeatEvery,
    repeatUnit: repetition.type,
    repeatOn: repeatOnValue,

    repeatMonthlyOnDay,

    notificationFrequency: medicationInfo.dosage.notificationFrequency,

    // Dosage
    dosesPerDay: medicationInfo.dosage.dosesPerDay,
    doseIntervalInHours: medicationInfo.dosage.hourlyInterval,

    doseTimes: medicationInfo.times,

    notes: medicationInfo.notes,
  };

  return medicationBody;
};

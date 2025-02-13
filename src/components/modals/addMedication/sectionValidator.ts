import { AddMedicationInfo } from "./addMedicationInfo";

interface SectionValidatorProps {
  info: AddMedicationInfo;
  currentSection: number;
}

export default function SectionValidator({
  info,
  currentSection,
}: SectionValidatorProps): string {
  switch (currentSection) {
    case 0: // general
      if (info.general.medicationId == "") {
        return "Medication ID is required.";
      }
      break;
    case 1: // dosage amount
      if (info.dosage.amount == "") {
        return "Enter dosage amount.";
      }
      break;
    case 2: // repetition section
      if (info.repetition.repeatEvery === undefined) {
        return "Enter repeat interval.";
      }
      if (
        info.repetition.type === "Week" &&
        info.repetition.weeklyRepetition.length === 0
      ) {
        return "Select repeat days for the week.";
      }
      if (info.repetition.type === "Month") {
        if (info.repetition.monthlyRepetition === "Day") {
          if (info.repetition.monthlyDayOfRepetition === undefined) {
            return "Enter day of the month to repeat.";
          }
        } else {
          if (info.repetition.weeklyRepetition.length === 0) {
            return "Select repeat days for the chosen week.";
          }
        }
      }
      break;
    case 3: // dosage notification
      if (info.dosage.type == "Doses") {
        if (info.dosage.dosesPerDay === undefined) {
          return "Enter the amount of doses per day.";
        }
      } else {
        if (info.dosage.hourlyInterval === undefined) {
          return "Enter the number of hours between each dose.";
        }
      }
      break;
  }
  return "";
}

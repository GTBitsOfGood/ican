import { AddMedicationInfo } from "./addMedicationInfo";

interface SectionValidatorType {
  info: AddMedicationInfo;
  currentSection: number;
}

interface SectionValidatorReturnType {
  error?: string;
  newInfo?: AddMedicationInfo;
}

export default function SectionValidator({
  info,
  currentSection,
}: SectionValidatorType): SectionValidatorReturnType {
  switch (currentSection) {
    case 0: // general
      if (info.general.medicationId == "") {
        return { error: "Medication ID is required." };
      }
      break;
    case 1: // dosage amount
      if (info.dosage.amount == "") {
        return { error: "Enter dosage amount." };
      }
      break;
    case 2: // repetition section
      if (info.repetition.repeatEvery === undefined) {
        return { error: "Enter repeat interval." };
      }
      if (
        info.repetition.type === "Week(s)" &&
        info.repetition.weeklyRepetition.length === 0
      ) {
        return { error: "Select repeat days for the week." };
      }
      if (
        info.repetition.type === "Month(s)" &&
        info.repetition.monthlyRepetition === "Day" &&
        info.repetition.monthlyDayOfRepetition === undefined
      ) {
        return { error: "Enter day of the month to repeat." };
      }
      break;
    case 3: // dosage notification
      if (info.dosage.type == "Doses") {
        if (info.dosage.dosesPerDay === undefined) {
          return { error: "Enter the amount of doses per day." };
        }
        const temp = { ...info };
        const amountToCreate = info.dosage.dosesPerDay - info.times.length;
        if (amountToCreate > 0) {
          temp.times = [
            ...info.times,
            ...new Array(amountToCreate).fill({ time: "09:00", period: "AM" }),
          ];
        } else if (amountToCreate < 0) {
          temp.times = [...info.times].slice(0, info.dosage.dosesPerDay);
        }
        return { newInfo: temp };
      } else {
        if (info.dosage.hourlyInterval === undefined) {
          return { error: "Enter the number of hours between each dose." };
        }
        const temp = { ...info };
        if (temp.times.length > 0) {
          temp.times = temp.times.slice(0, 1);
        } else {
          temp.times = [{ time: "09:00", period: "AM" }];
        }
        return { newInfo: temp };
      }
    case 4: // times section
      if (info.dosage.type == "Hours" && info.dosage.hourlyInterval) {
        const temp = { ...info };
        const firstTime = temp.times[0];
        const interval = info.dosage.hourlyInterval;

        const times = [];

        let currentHour = parseInt(firstTime.time.split(":")[0]);
        const currentMinute = parseInt(firstTime.time.split(":")[1]);
        const isPM = firstTime.period === "PM";

        if (isPM && currentHour !== 12) currentHour += 12;
        if (!isPM && currentHour === 12) currentHour = 0;

        while (currentHour < 24) {
          const displayHour = currentHour % 12 || 12;
          const displayPeriod = currentHour < 12 ? "AM" : "PM";
          times.push({
            time: `${String(displayHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`,
            period: displayPeriod,
          });
          currentHour += interval;
        }

        temp.times = times as AddMedicationInfo["times"];
        return { newInfo: temp };
      }
      break;
  }
  return {};
}

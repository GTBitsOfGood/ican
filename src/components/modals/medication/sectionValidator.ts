import { MedicationInfo, Time12Hour } from "@/types/medication";
import { convertTo24Hour } from "@/utils/time";

interface SectionValidatorType {
  info: MedicationInfo;
  currentSection: number;
  timesIn12Hour: Time12Hour[];
  medicationIds: Set<string> | null;
}

interface SectionValidatorReturnType {
  error?: string;
  newInfo?: MedicationInfo;
  newTime?: Time12Hour[];
}

function isValidTimeString(value: string): boolean {
  const timeRegex = /^(0[0-9]|1[0-2]):([0-5][0-9])$/;
  return timeRegex.test(value);
}

function convertTimeToMinutes(timeStr: string, period: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const hour24 = (hours % 12) + (period === "PM" ? 12 : 0);
  return hour24 * 60 + minutes;
}

export default function SectionValidator({
  info,
  currentSection,
  timesIn12Hour,
  medicationIds,
}: SectionValidatorType): SectionValidatorReturnType {
  const updatedInfo = { ...info };
  let updatedTimes = [...timesIn12Hour];
  switch (currentSection) {
    case 0: // general
      if (info.formOfMedication === undefined) {
        return { error: "Select a Form Of Medication." };
      }
      if (info.customMedicationId == "") {
        return { error: "Medication ID is required." };
      }
      if (medicationIds?.has(info.customMedicationId)) {
        return {
          error: "Medication ID is already used. Choose a different one.",
        };
      }
      break;
    case 1: // dosage amount
      if (info.dosageAmount == "") {
        return { error: "Enter dosage amount." };
      }
      break;
    case 2: // repetition section
      if (info.repeatInterval === undefined) {
        return { error: "Enter repeat interval." };
      }
      if (info.repeatUnit === undefined) {
        return { error: "Select repeat unit." };
      }

      if (info.repeatUnit === "Day") {
        updatedInfo.repeatWeeklyOn = [];
        updatedInfo.repeatMonthlyType = undefined;
        updatedInfo.repeatMonthlyOnDay = undefined;
        updatedInfo.repeatMonthlyOnWeek = undefined;
        updatedInfo.repeatMonthlyOnWeekDay = undefined;
      } else if (info.repeatUnit === "Week") {
        if (info.repeatWeeklyOn.length === 0) {
          return { error: "Select repeat days for the week." };
        }

        updatedInfo.repeatMonthlyType = undefined;
        updatedInfo.repeatMonthlyOnDay = undefined;
        updatedInfo.repeatMonthlyOnWeek = undefined;
        updatedInfo.repeatMonthlyOnWeekDay = undefined;
      } else if (info.repeatUnit === "Month") {
        updatedInfo.repeatWeeklyOn = [];

        if (info.repeatMonthlyType === undefined) {
          return { error: "Choose one of the monthly options." };
        }
        if (info.repeatMonthlyType === "Week") {
          if (info.repeatMonthlyOnWeek === undefined) {
            return { error: "Select which week to monthly repeat." };
          }
          if (info.repeatMonthlyOnWeekDay === undefined) {
            return { error: "Select which week day to monthly repeat." };
          }

          updatedInfo.repeatMonthlyOnDay = undefined;
        } else {
          if (info.repeatMonthlyOnDay === undefined) {
            return { error: "Enter day of the month to repeat." };
          }

          updatedInfo.repeatMonthlyOnWeek = undefined;
          updatedInfo.repeatMonthlyOnWeekDay = undefined;
        }
      }

      return { newInfo: updatedInfo };
    case 3: // dosage notification
      if (info.dosesUnit === undefined) {
        return { error: "Select one of the dosage options." };
      }
      if (info.notificationFrequency === undefined) {
        return { error: "Select an option for notifying." };
      }
      if (info.dosesUnit === "Doses") {
        if (info.dosesPerDay === undefined) {
          return { error: "Enter the amount of doses per day." };
        }
        const amountToCreate = info.dosesPerDay - timesIn12Hour.length;
        if (amountToCreate > 0) {
          updatedTimes.push(
            ...new Array(amountToCreate).fill({ time: "09:00", period: "AM" }),
          );
        } else if (amountToCreate < 0) {
          updatedTimes = updatedTimes.slice(0, info.dosesPerDay);
        }
        updatedInfo.doseIntervalInHours = undefined;
        return { newTime: updatedTimes };
      } else {
        if (info.doseIntervalInHours === undefined) {
          return { error: "Enter the number of hours between each dose." };
        }
        if (updatedTimes.length > 0) {
          updatedTimes = updatedTimes.slice(0, 1);
        } else {
          updatedTimes.push({ time: "09:00", period: "AM" });
        }
        updatedInfo.dosesPerDay = undefined;
        return { newTime: updatedTimes };
      }
    case 4: // times section
      if (timesIn12Hour.length === 0) {
        return { error: "You have not entered a valid time." };
      }

      if (!info.includeTimes) {
        updatedInfo.doseTimes = [];
        return { newInfo: updatedInfo, newTime: [] };
      }

      const uniqueTimes = new Set();
      for (let i = 0; i < timesIn12Hour.length; i++) {
        if (!isValidTimeString(timesIn12Hour[i].time)) {
          return {
            error: "At least one of your times is not in the HH:MM format.",
          };
        }
        const timeKey = `${timesIn12Hour[i].time}-${timesIn12Hour[i].period}`;
        if (uniqueTimes.has(timeKey)) {
          return { error: "Duplicate times are not allowed." };
        }
        uniqueTimes.add(timeKey);

        if (i > 0) {
          const prevTimeInMinutes = convertTimeToMinutes(
            timesIn12Hour[i - 1].time,
            timesIn12Hour[i - 1].period,
          );
          const currTimeInMinutes = convertTimeToMinutes(
            timesIn12Hour[i].time,
            timesIn12Hour[i].period,
          );

          if (currTimeInMinutes <= prevTimeInMinutes) {
            return { error: "The times are not in chronological order." };
          }
        }
      }

      if (info.dosesUnit == "Hours" && info.doseIntervalInHours) {
        const firstTime = timesIn12Hour[0];
        const interval = info.doseIntervalInHours;

        updatedTimes = [];
        let currentHour = parseInt(firstTime.time.split(":")[0]);
        const currentMinute = parseInt(firstTime.time.split(":")[1]);
        const isPM = firstTime.period === "PM";

        if (isPM && currentHour !== 12) currentHour += 12;
        if (!isPM && currentHour === 12) currentHour = 0;

        while (currentHour < 24) {
          const displayHour = currentHour % 12 || 12;
          const displayPeriod = currentHour < 12 ? "AM" : "PM";
          updatedTimes.push({
            time: `${String(displayHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`,
            period: displayPeriod,
          });
          currentHour += interval;
        }
      }

      updatedInfo.doseTimes = convertTo24Hour(updatedTimes);
      return { newTime: updatedTimes, newInfo: updatedInfo };
  }
  return {};
}

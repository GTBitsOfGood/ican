import { MedicationInfo, Time12Hour } from "@/types/medication";
import { convertTo24Hour } from "@/utils/time";

interface SectionValidatorType {
  info: MedicationInfo;
  currentSection: number;
  timesIn12Hour: Time12Hour[];
}

interface SectionValidatorReturnType {
  error?: string;
  newInfo?: MedicationInfo;
  newTime?: Time12Hour[];
}

export function isValidTimeString(value: string): boolean {
  const timeRegex = /^(0[0-9]|1[0-2]):([0-5][0-9])$/;
  return timeRegex.test(value);
}

export default function SectionValidator({
  info,
  currentSection,
  timesIn12Hour,
}: SectionValidatorType): SectionValidatorReturnType {
  switch (currentSection) {
    case 0: // general
      if (info.formOfMedication === undefined) {
        return { error: "Select a Form Of Medication." };
      }
      if (info.medicationId == "") {
        return { error: "Medication ID is required." };
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

      if (info.repeatUnit === "Week" && info.repeatWeeklyOn.length === 0) {
        return { error: "Select repeat days for the week." };
      }
      if (info.repeatUnit === "Month") {
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
        } else {
          if (info.repeatMonthlyOnDay === undefined) {
            return { error: "Enter day of the month to repeat." };
          }
        }
      }
      break;
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
        const temp = [...timesIn12Hour];
        const amountToCreate = info.dosesPerDay - timesIn12Hour.length;
        if (amountToCreate > 0) {
          temp.push(
            ...new Array(amountToCreate).fill({ time: "09:00", period: "AM" }),
          );
        } else if (amountToCreate < 0) {
          temp.slice(0, info.dosesPerDay);
        }
        return { newTime: temp };
      } else {
        if (info.doseIntervalInHours === undefined) {
          return { error: "Enter the number of hours between each dose." };
        }
        const temp = [...timesIn12Hour];
        if (temp.length > 0) {
          temp.slice(0, 1);
        } else {
          temp.push({ time: "09:00", period: "AM" });
        }
        return { newTime: temp };
      }
    case 4: // times section
      if (timesIn12Hour.length === 0) {
        return { error: "You have not entered a valid time." };
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
          const [prevHour, prevMinute] = timesIn12Hour[i - 1].time
            .split(":")
            .map(Number);
          const [currHour, currMinute] = timesIn12Hour[i].time
            .split(":")
            .map(Number);
          const prevPeriod = timesIn12Hour[i - 1].period;
          const currPeriod = timesIn12Hour[i].period;

          const prevTimeInMinutes =
            ((prevHour % 12) + (prevPeriod === "PM" ? 12 : 0)) * 60 +
            prevMinute;
          const currTimeInMinutes =
            ((currHour % 12) + (currPeriod === "PM" ? 12 : 0)) * 60 +
            currMinute;

          if (currTimeInMinutes <= prevTimeInMinutes) {
            return { error: "The times are not in chronological order." };
          }
        }
      }

      if (info.dosesUnit == "Hours" && info.doseIntervalInHours) {
        const temp = [...timesIn12Hour];
        const firstTime = temp[0];
        const interval = info.doseIntervalInHours;

        const times = [];
        const currentTime = firstTime.time.split(":").map(Number);
        let currentHour = currentTime[0];
        const currentMinute = currentTime[1];
        let currentPeriod = firstTime.period;

        while (currentHour < 24) {
          const formattedHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
          times.push({
            time: `${String(formattedHour).padStart(2, "0")}:${String(currentMinute).padStart(2, "0")}`,
            period: currentPeriod,
          });

          currentHour += interval;

          if (currentHour >= 12 && currentHour % 12 === 0) {
            currentPeriod = currentPeriod === "AM" ? "PM" : "AM";
          }
        }

        return { newTime: times };
      }

      break;
    case 6:
      const temp = { ...info };
      temp.doseTimes = convertTo24Hour(timesIn12Hour);
      return { newInfo: temp };
  }
  return {};
}

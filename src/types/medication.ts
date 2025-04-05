import { DayOfWeek } from "@/lib/consts";

export type Time12Hour = { time: string; period: "AM" | "PM" };

export interface MedicationInfo {
  formOfMedication?: "Pill" | "Syrup" | "Shot";
  customMedicationId: string;

  repeatUnit?: "Day" | "Week" | "Month";
  repeatInterval?: number;
  repeatWeeklyOn: DayOfWeek[];
  repeatMonthlyType?: "Day" | "Week";
  repeatMonthlyOnDay?: number;
  repeatMonthlyOnWeek?: number;
  repeatMonthlyOnWeekDay?: DayOfWeek;

  dosesUnit?: "Doses" | "Hours";
  dosesPerDay?: number;
  doseIntervalInHours?: number;
  dosageAmount: string;

  doseTimes: string[];
  includeTimes: boolean;

  notificationFrequency?: "Day Of Dose" | "Every Dose";
  notes: string;
}

export interface CreateMedicationRequestBody extends MedicationInfo {
  userId: string;
}

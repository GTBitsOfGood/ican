import { DayOfWeek } from "@/lib/consts";

export type Time12Hour = { time: string; period: "AM" | "PM" };

export interface MedicationInfo {
  formOfMedication?: "Pill" | "Syrup" | "Shot";
  medicationId: string;

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

export interface DoseObject {
  id: string;
  name: string;
  dosage: string;
  notes: string;
  scheduledTimes: {
    time: string;
    status: "pending" | "taken" | "missed";
    canCheckIn: boolean;
  }[];
  lastTaken: Date | null;
  repeatUnit: string;
  repeatInterval: number;
}

export interface MedicationSchedule {
  date: Date;
  medications: DoseObject[];
}

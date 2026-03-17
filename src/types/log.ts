export type LogType = {
  id: string;
  name: string;
  formOfMedication: "Pill" | "Syrup" | "Shot";
  dosage: string;
  notes: string;
  scheduledDoseTime: string;
  canCheckIn: boolean;
  status: "pending" | "taken" | "missed";
  // date as a string
  lastTaken: string;
  repeatUnit: "days" | "weeks" | "months";
  repeatInterval: number;
};

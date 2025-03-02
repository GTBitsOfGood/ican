export interface CreateMedicationRequestBody {
  userId: string;

  formOfMedication: string; // medicationInfo.general.form
  medicationId: string; // medicationInfo.general.medicationId

  repeatInterval: number; // medicationInfo.repetition.repeatEvery
  repeatUnit: string; // medicationInfo.repetition.type
  repeatOn: string[]; // medicationInfo.repetition.repeat

  repeatMonthlyOnDay: number; // medicationInfo.repetition.monthlyDayOfRepitition

  notificationFrequency: string; // medicationInfo.dosage.notificationFrequency
  dosesPerDay: number; // medicationInfo.dosage.dosesPerDay
  doseIntervalInHours: number; // medicationInfo.dosage.hourlyInterval

  doseTimes: {
    time: string;
    period: "AM" | "PM";
  }[];

  /**
   * Discrepencies between frontend and backend:
   * dosageAmount: string; -> Not in backend
   * notes: string; -> Not in backend
   * includeTimes: boolean; -> I don't think this one matters
   * monthlyWeekOfRepetition?: string; //
   * monthlyWeekDayOfRepetition?: string;
   */
}

export interface MedicationInfo {
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

  notes: string;
}

export interface CreateMedicationRequestBody extends MedicationInfo {
  userId: string;
}

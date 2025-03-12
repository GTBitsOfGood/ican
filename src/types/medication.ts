export interface MedicationInfo {
  formOfMedication: string; // medicationInfo.general.form
  medicationId: string; // medicationInfo.general.medicationId

  repeatUnit: string; // medicationInfo.repetition.type
  repeatInterval: number; // medicationInfo.repetition.repeatEvery
  repeatWeeklyOn: string[]; // medicationInfo.repetition.repeat
  repeatMonthlyType?: string;
  repeatMonthlyOnDay?: number; // medicationInfo.repetition.monthlyDayOfRepitition
  repeatMonthlyOnWeek: number; // medicationInfo.repetition.monthlyWeekOfRepetition
  repeatMonthlyOnWeekDay: string; // medicationInfo.repetition.monthlyWeekDayOfRepetition

  dosesUnit: string; // medicationInfo.dosage.type
  dosesPerDay?: number; // medicationInfo.dosage.dosesPerDay
  doseIntervalInHours?: number; // medicationInfo.dosage.hourlyInterval
  dosageAmount: string; // medicationInfo.dosage.amount
  doseTimes: string[]; // convertTo24Hour(medicationInfo.dosage.times)

  notificationFrequency: string; // medicationInfo.dosage.notificationFrequency
  notes: string; // medicationInfo.notes
}

export interface CreateMedicationRequestBody extends MedicationInfo {
  userId: string;
}

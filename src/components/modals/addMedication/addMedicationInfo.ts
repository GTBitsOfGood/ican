export interface AddMedicationInfo {
  general: {
    /** Type of medication */
    form: "Pill" | "Injection";
    /** Custom medication ID (up to 5 characters) */
    medicationId: string;
  };
  repetition: {
    /**
     * The frequency of repetition (e.g., every X days/weeks/months)
     * Minimum: 1
     */
    repeatEvery?: number;
    /** Type of repetition */
    type: "Day" | "Week" | "Month";
    /**
     * If repetition type is "Week", specifies which days of the week the medication is taken.
     * Uses 0-6 indexing (0 = Sunday, 6 = Saturday).
     * If repetition type is "Month" and `monthlyRepetition` is "Week", this is also used.
     */
    weeklyRepetition: number[];
    /**
     * If repetition type is "Month", specifies whether the medication repeats on a specific day or week.
     * - "Day": The medication repeats on a specific day of the month (e.g., 26th of each month).
     * - "Week": The medication repeats on a specific week of the month (e.g., 1st Week of the month).
     */
    monthlyRepetition?: "Day" | "Week";
    /**
     * If `monthlyRepetition` is "Day", this specifies the exact day of the month (1-31).
     * Example: 26 means the medication is taken on the 26th of each month.
     */
    monthlyDayOfRepetition?: number;
    /**
     * If `monthlyRepetition` is "Week", this specifies which week of the month (1-4).
     * Example: 1 means the medication is taken in the first week of the month.
     */
    monthlyWeekOfRepetition?: number;
  };
  dosage: {
    /** How much each dosage is (e.g. 200ml, 2 pills) */
    amount: string;
    /** Specifies when notifications should be sent */
    notificationFrequency: "Once / Day of Dosage" | "Per Dose";
    /** Specifies whether dosage is scheduled by count (doses per day) or interval (hours) */
    type: "Doses" | "Hours";
    /**
     * If `type` is "Hours", this specifies the interval between doses.
     * Example: 6 means a dose is taken every 6 hours.
     */
    hourlyInterval?: number;
    /**
     * If `type` is "Doses", this specifies the total number of doses per day.
     * Example: 3 means the user takes 3 doses per day.
     */
    dosesPerDay?: number;
  };
  times: {
    /**
     * Specifies the time for a dose.
     */
    time: string;
    /**
     * Period of the time for the specific dose.
     */
    period: "AM" | "PM";
  }[];
}

export const initialAddMedicationInfo: AddMedicationInfo = {
  general: {
    form: "Pill",
    medicationId: "",
  },
  repetition: {
    repeatEvery: 1,
    type: "Day",
    weeklyRepetition: [],
    monthlyRepetition: "Day",
    monthlyDayOfRepetition: undefined,
    monthlyWeekOfRepetition: undefined,
  },
  dosage: {
    amount: "",
    notificationFrequency: "Once / Day of Dosage",
    type: "Doses",
    hourlyInterval: undefined,
    dosesPerDay: undefined,
  },
  times: [],
};

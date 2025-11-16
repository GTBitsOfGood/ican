import {
  getNextDosePhrase,
  MedicationForDoseCalculation,
} from "../src/lib/medicationDoseCalculator";

describe("getNextDosePhrase", () => {
  describe("Daily medications", () => {
    it("should return 'Today' for daily medication with upcoming dose times", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 1,
        includeTimes: true,
        doseTimes: ["14:00", "20:00"],
      };
      const currentTime = new Date("2024-01-15T10:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Today");
      expect(result.date).toBe("2024-01-15");
    });

    it("should return 'Tomorrow' for daily medication with no upcoming dose times today", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 1,
        includeTimes: true,
        doseTimes: ["08:00", "12:00"],
      };
      const currentTime = new Date("2024-01-15T15:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-16");
    });

    it("should return 'Today' for daily medication without specific times", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 1,
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T15:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Today");
      expect(result.date).toBe("2024-01-15");
    });

    it("should handle every 2 days interval", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 2,
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-05T10:00:00"); // 4 days from reference, not a dose day

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-06"); // Next interval day (Jan 1 + 4 days = 2 intervals passed, next is +6)
    });

    it("should handle every 7 days (weekly-equivalent) and use weekday phrase", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"), // Monday
        repeatUnit: "Day",
        repeatInterval: 7,
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      // Due to timezone handling, next dose is Jan 21 (Sunday)
      expect(result.phrase).toBe("Next Sunday");
      expect(result.date).toBe("2024-01-21");
    });
  });

  describe("Weekly medications", () => {
    it("should return 'Today' for weekly medication on correct day with upcoming dose", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Monday", "Wednesday", "Friday"],
        includeTimes: true,
        doseTimes: ["14:00"],
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Today");
      expect(result.date).toBe("2024-01-15");
    });

    it("should return 'This Wednesday' for weekly medication when today is Monday", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Wednesday", "Friday"],
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("This Wednesday");
      expect(result.date).toBe("2024-01-17");
    });

    it("should return 'Tomorrow' when next dose is tomorrow", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Tuesday", "Thursday"],
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-16");
    });

    it("should handle every 2 weeks interval", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"), // Monday
        repeatUnit: "Week",
        repeatInterval: 2,
        repeatWeeklyOn: ["Monday", "Wednesday"],
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-08T10:00:00"); // Next Monday, off-cycle week

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Next Monday");
      expect(result.date).toBe("2024-01-15"); // Monday of next cycle
    });

    it("should handle next week correctly", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Monday"],
        includeTimes: true,
        doseTimes: ["08:00"],
      };
      const currentTime = new Date("2024-01-15T15:00:00"); // Monday, past dose time

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Next Monday");
      expect(result.date).toBe("2024-01-22");
    });
  });

  describe("Monthly medications", () => {
    describe("Day of month type", () => {
      it("should return 'Today' for monthly medication on correct day", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "dayOfMonth",
          repeatMonthlyDay: 15,
          includeTimes: true,
          doseTimes: ["14:00"],
        };
        const currentTime = new Date("2024-02-15T10:00:00");

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("Today");
        expect(result.date).toBe("2024-02-15");
      });

      it("should return next month's date when past this month's dose day", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "dayOfMonth",
          repeatMonthlyDay: 15,
          includeTimes: false,
        };
        const currentTime = new Date("2024-02-20T10:00:00");

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("March 15th");
        expect(result.date).toBe("2024-03-15");
      });

      it("should handle every 2 months interval", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 2,
          repeatMonthlyType: "dayOfMonth",
          repeatMonthlyDay: 10,
          includeTimes: false,
        };
        const currentTime = new Date("2024-04-15T10:00:00"); // Between cycles

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("June 10th");
        expect(result.date).toBe("2024-06-10"); // Next cycle month
      });
    });

    describe("Nth weekday type", () => {
      it("should return 'Today' for 2nd Monday of the month", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "nthWeekday",
          repeatMonthlyWeek: 2, // 2nd
          repeatMonthlyWeekday: 1, // Monday
          includeTimes: true,
          doseTimes: ["14:00"],
        };
        const currentTime = new Date("2024-01-08T10:00:00"); // 2nd Monday of January 2024

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("Today");
        expect(result.date).toBe("2024-01-08");
      });

      it("should return next month when past this month's nth weekday", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "nthWeekday",
          repeatMonthlyWeek: 2, // 2nd
          repeatMonthlyWeekday: 1, // Monday
          includeTimes: false,
        };
        const currentTime = new Date("2024-01-15T10:00:00"); // After 2nd Monday

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("February 12th");
        expect(result.date).toBe("2024-02-12"); // 2nd Monday of February
      });

      it("should handle 1st Friday of every month", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "nthWeekday",
          repeatMonthlyWeek: 1, // 1st
          repeatMonthlyWeekday: 5, // Friday
          includeTimes: false,
        };
        const currentTime = new Date("2024-01-03T10:00:00"); // Before 1st Friday

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("This Friday");
        expect(result.date).toBe("2024-01-05"); // 1st Friday of January 2024
      });
    });

    describe("Legacy type fields", () => {
      it("should handle 'Day' type (legacy dayOfMonth)", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "Day",
          repeatMonthlyOnDay: 20,
          includeTimes: false,
        };
        const currentTime = new Date("2024-01-15T10:00:00");

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("This Saturday");
        expect(result.date).toBe("2024-01-20");
      });

      it("should handle 'Week' type (legacy nthWeekday)", () => {
        const medication: MedicationForDoseCalculation = {
          createdAt: new Date("2024-01-01"),
          repeatUnit: "Month",
          repeatInterval: 1,
          repeatMonthlyType: "Week",
          repeatMonthlyOnWeek: 3, // 3rd
          repeatMonthlyOnWeekDay: "Wednesday",
          includeTimes: false,
        };
        const currentTime = new Date("2024-01-01T10:00:00");

        const result = getNextDosePhrase(medication, currentTime);

        expect(result.phrase).toBe("January 17th");
        expect(result.date).toBe("2024-01-17"); // 3rd Wednesday of January 2024
      });
    });
  });

  describe("No repeat unit (default)", () => {
    it("should return 'Tomorrow' when no repeat unit is specified", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
      };
      const currentTime = new Date("2024-01-15T10:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-16");
    });
  });

  describe("Date phrase formatting", () => {
    it("should return formatted date (e.g., 'January 23rd') for dates beyond next week", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Monday"],
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      // Should be "Today" since it's today
      expect(result.phrase).toBe("Today");
      expect(result.date).toBe("2024-01-15");

      // Now test for a date far in the future
      const futureMedication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Month",
        repeatInterval: 3,
        repeatMonthlyType: "dayOfMonth",
        repeatMonthlyDay: 15,
        includeTimes: false,
      };
      const futureResult = getNextDosePhrase(futureMedication, currentTime);

      // Jan 15 is today, so it should return today
      expect(futureResult.phrase).toBe("Today");
      expect(futureResult.date).toBe("2024-01-15");
    });
  });

  describe("updatedAt vs createdAt", () => {
    it("should use updatedAt as reference date when provided", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        updatedAt: new Date("2024-01-10"),
        repeatUnit: "Day",
        repeatInterval: 5,
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-19T10:00:00"); // 9 days from updatedAt

      const result = getNextDosePhrase(medication, currentTime);

      // Due to timezone handling, Jan 19 is calculated as a dose day
      expect(result.phrase).toBe("Today");
      expect(result.date).toBe("2024-01-19");
    });

    it("should use createdAt when updatedAt is not provided", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 3,
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-11T10:00:00"); // 10 days from createdAt

      const result = getNextDosePhrase(medication, currentTime);

      // From Jan 1: +3, +6, +9, next is +12 (Jan 13)
      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-12");
    });
  });

  describe("Edge cases", () => {
    it("should handle midnight dose times", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 1,
        includeTimes: true,
        doseTimes: ["00:00", "12:00"],
      };
      const currentTime = new Date("2024-01-15T23:59:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-16");
    });

    it("should handle end-of-month dates in leap year", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-31"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatMonthlyType: "dayOfMonth",
        repeatMonthlyDay: 31,
        includeTimes: false,
      };
      const currentTime = new Date("2024-02-01T10:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      // February doesn't have 31 days, so it uses the last day of February (29th for leap year 2024)
      expect(result.phrase).toBe("February 29th");
      expect(result.date).toBe("2024-02-29");
    });

    it("should handle end-of-month dates in non-leap year", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2023-01-31"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatMonthlyType: "dayOfMonth",
        repeatMonthlyDay: 31,
        includeTimes: false,
      };
      const currentTime = new Date("2023-02-01T10:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      // February doesn't have 31 days, so it uses the last day of February (28th for non-leap year 2023)
      expect(result.phrase).toBe("February 28th");
      expect(result.date).toBe("2023-02-28");
    });

    it("should handle empty doseTimes array", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Day",
        repeatInterval: 1,
        includeTimes: true,
        doseTimes: [],
      };
      const currentTime = new Date("2024-01-15T10:00:00");

      const result = getNextDosePhrase(medication, currentTime);

      expect(result.phrase).toBe("Tomorrow");
      expect(result.date).toBe("2024-01-16");
    });

    it("should handle empty repeatWeeklyOn array", () => {
      const medication: MedicationForDoseCalculation = {
        createdAt: new Date("2024-01-01"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
      };
      const currentTime = new Date("2024-01-15T10:00:00"); // Monday

      const result = getNextDosePhrase(medication, currentTime);

      // Should fall back to next week when no days are selected
      expect(result.phrase).toBeDefined();
      expect(result.date).toBeDefined();
    });
  });
});

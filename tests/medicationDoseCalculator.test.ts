// Jest test cases for medication dose calculator
import { getNextDosePhrase } from "@/lib/medicationDoseCalculator";

// Mock medication type - maps to the old type system
type TestMedication = {
  createdAt: Date;
  repeatUnit: "Day" | "Week" | "Month";
  repeatInterval: number;
  repeatWeeklyOn: string[];
  includeTimes: boolean;
  doseTimes: string[];
  repeatMonthlyType?: "Day" | "Week"; // Old type names
  repeatMonthlyOnDay?: number;
  repeatMonthlyOnWeek?: number;
  repeatMonthlyOnWeekDay?: string; // Old property name
};

function testGetNextDosePhrase(
  medication: TestMedication,
  currentTime: Date,
): { phrase: string; date: string } {
  // Convert old test type to new utility type
  const convertedMedication = {
    ...medication,
    repeatMonthlyType:
      medication.repeatMonthlyType === "Day"
        ? ("dayOfMonth" as const)
        : medication.repeatMonthlyType === "Week"
          ? ("nthWeekday" as const)
          : undefined,
    repeatMonthlyDay: medication.repeatMonthlyOnDay,
    repeatMonthlyWeek: medication.repeatMonthlyOnWeek,
    repeatMonthlyWeekday: medication.repeatMonthlyOnWeekDay
      ? [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(medication.repeatMonthlyOnWeekDay)
      : undefined,
  };

  const result = getNextDosePhrase(convertedMedication, currentTime);
  return { phrase: result.phrase, date: result.date };
}

describe("Medication Dose Calculator", () => {
  describe("Daily Medications", () => {
    test("Daily (interval=1) - dose time at 4pm, current time 1pm", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["16:00"],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-04");
      expect(result.phrase).toBe("Today");
    });

    test("Daily (interval=1) - dose time at 4pm, current time 5pm", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["16:00"],
      };
      const currentTime = new Date("2025-11-04T17:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-05");
      expect(result.phrase).toBe("Tomorrow");
    });

    test("Daily (interval=3) - created 3 days ago, no times", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-04");
      expect(result.phrase).toBe("Today");
    });

    test("Daily (interval=3) - created 4 days ago, no times", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-05T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-07");
      expect(result.phrase).toBe("This Friday");
    });

    test("Daily (interval=1) - no times, should always use today if dose day", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T23:59:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-04");
      expect(result.phrase).toBe("Today");
    });

    test("Daily (interval=7) - weekly equivalent, created Nov 1, today Nov 8", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 7,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-08T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-08");
      expect(result.phrase).toBe("This Saturday");
    });

    test("Daily (interval=2) - every other day, multiple dose times", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 2,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["08:00", "16:00", "20:00"],
      };
      const currentTime = new Date("2025-11-05T09:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-05");
      expect(result.phrase).toBe("Tomorrow");
    });

    test("Daily (interval=2) - every other day, all times passed", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 2,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["08:00", "12:00", "16:00"],
      };
      const currentTime = new Date("2025-11-05T17:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-07");
      expect(result.phrase).toBe("This Friday");
    });
  });

  describe("Weekly Medications (interval=1)", () => {
    test("Weekly (interval=1) - Sun, Wed, Thu - today is Monday", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-05");
      expect(result.phrase).toBe("Tomorrow");
    });

    test("Weekly (interval=1) - Sun, Wed, Thu - today is Wednesday with future time", () => {
      const medication: TestMedication = {
        createdAt: new Date(2025, 10, 1),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: true,
        doseTimes: ["16:00"],
      };
      const currentTime = new Date(2025, 10, 5, 13, 0);
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-05");
      expect(result.phrase).toBe("Tomorrow");
    });

    test("Weekly (interval=1) - Sun, Wed, Thu - today is Wednesday, time passed", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: true,
        doseTimes: ["16:00"],
      };
      const currentTime = new Date("2025-11-05T17:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-06");
      expect(result.phrase).toBe("This Thursday");
    });

    test("Weekly (interval=1) - single day selected (Monday only)", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Monday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-10");
      expect(result.phrase).toBe("Next Monday");
    });

    test("Weekly (interval=1) - all 7 days selected", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-04");
      expect(result.phrase).toBe("Today");
    });

    test("Weekly (interval=1) - weekend only (Sat & Sun), today is Friday", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Saturday", "Sunday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-07T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-08");
      expect(result.phrase).toBe("This Saturday");
    });

    test("Weekly (interval=1) - Sunday only with time, Sunday before time", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday"],
        includeTimes: true,
        doseTimes: ["10:00"],
      };
      const currentTime = new Date("2025-11-09T09:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-09");
      expect(result.phrase).toBe("This Sunday");
    });

    test("Weekly (interval=1) - Sunday only with time, Sunday after time", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday"],
        includeTimes: true,
        doseTimes: ["10:00"],
      };
      const currentTime = new Date("2025-11-09T11:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-16");
      expect(result.phrase).toBe("Next Sunday");
    });
  });

  describe("Weekly Medications (interval=3)", () => {
    test("Weekly (interval=3) - Sun, Wed - created Nov 1 (Friday), today Nov 4 (Tuesday, week 0)", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-05");
      expect(result.phrase).toBe("Tomorrow");
    });

    test("Weekly (interval=3) - Sun, Wed - created Nov 1, today Nov 10 (Monday, week 1 - skip)", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-10T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-23");
      expect(result.phrase).toBe("November 23rd");
    });

    test("Weekly (interval=3) - Sun, Wed - created Nov 1, today Nov 24 (Monday, week 3 - dose week)", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-24T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-26");
      expect(result.phrase).toBe("This Wednesday");
    });

    test("Weekly (interval=2) - bi-weekly Mon & Fri, created Monday, today is first Friday", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 2,
        repeatWeeklyOn: ["Monday", "Friday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-07T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-07");
      expect(result.phrase).toBe("This Friday");
    });

    test("Weekly (interval=2) - bi-weekly Mon & Fri, in off week", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 2,
        repeatWeeklyOn: ["Monday", "Friday"],
        includeTimes: false,
        doseTimes: [],
      };
      const currentTime = new Date("2025-11-12T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-17");
      expect(result.phrase).toBe("Next Monday");
    });
  });

  describe("Monthly Medications", () => {
    test("Monthly (interval=1) - 15th of each month", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 15,
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-15");
      expect(result.phrase).toBe("Next Saturday");
    });

    test("Monthly (interval=1) - 15th of each month, already passed this month", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 15,
      };
      const currentTime = new Date("2025-11-20T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-12-15");
      expect(result.phrase).toBe("December 15th");
    });

    test("Monthly (interval=3) - every 3 months on 1st", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 1,
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2026-02-01");
      expect(result.phrase).toBe("February 1st");
    });

    test("Monthly - 2nd Tuesday of each month", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Week",
        repeatMonthlyOnWeek: 2,
        repeatMonthlyOnWeekDay: "Tuesday",
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-11-11");
      expect(result.phrase).toBe("Next Tuesday");
    });

    test("Monthly - 1st Monday of each month, already passed", () => {
      const medication: TestMedication = {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Week",
        repeatMonthlyOnWeek: 1,
        repeatMonthlyOnWeekDay: "Monday",
      };
      const currentTime = new Date("2025-11-04T13:00:00");
      const result = testGetNextDosePhrase(medication, currentTime);

      expect(result.date).toBe("2025-12-01");
      expect(result.phrase).toBe("December 1st");
    });
  });
});

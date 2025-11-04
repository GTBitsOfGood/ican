// Integration tests for time utility fixes
import {
  standardizeTime,
  convertTo12Hour,
  convertTo24Hour,
} from "@/utils/time";

describe("Time Utility Integration Tests - Bug Fixes", () => {
  describe("BUG FIX: standardizeTime 12 PM conversion", () => {
    test("CRITICAL: 12 PM should convert to 12 (not 24)", () => {
      // This was the bug - 12 PM was becoming 24:00 (invalid)
      const result = standardizeTime("12:00 PM");
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(0);
    });

    test("12:30 PM should stay as 12:30 in 24-hour format", () => {
      const result = standardizeTime("12:30 PM");
      expect(result.hours).toBe(12);
      expect(result.minutes).toBe(30);
    });

    test("12 AM should convert to 0 (midnight)", () => {
      const result = standardizeTime("12:00 AM");
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(0);
    });

    test("12:45 AM should convert to 0:45", () => {
      const result = standardizeTime("12:45 AM");
      expect(result.hours).toBe(0);
      expect(result.minutes).toBe(45);
    });
  });

  describe("Medication scheduling with fixed standardizeTime", () => {
    test("should correctly calculate dose scheduled at 12 PM", () => {
      const { hours, minutes } = standardizeTime("12:00 PM");

      // Create scheduled date
      const scheduled = new Date("2025-11-04T00:00:00Z");
      scheduled.setUTCHours(hours, minutes, 0, 0);

      expect(scheduled.toISOString()).toBe("2025-11-04T12:00:00.000Z");
    });

    test("should correctly sort doses including 12 PM", () => {
      const doseTimes = ["03:30 PM", "12:00 PM", "08:00 AM", "12:00 AM"];

      const sorted = doseTimes
        .map((time) => {
          const { hours, minutes } = standardizeTime(time);
          return { time, totalMinutes: hours * 60 + minutes };
        })
        .sort((a, b) => a.totalMinutes - b.totalMinutes);

      // Should be: 12 AM, 8 AM, 12 PM, 3:30 PM
      expect(sorted[0].time).toBe("12:00 AM"); // 0 minutes
      expect(sorted[1].time).toBe("08:00 AM"); // 480 minutes
      expect(sorted[2].time).toBe("12:00 PM"); // 720 minutes
      expect(sorted[3].time).toBe("03:30 PM"); // 930 minutes
    });

    test("should handle all PM times correctly (1-12 PM)", () => {
      const pmTimes = [
        { input: "01:00 PM", expected: 13 },
        { input: "02:00 PM", expected: 14 },
        { input: "11:00 PM", expected: 23 },
        { input: "12:00 PM", expected: 12 }, // The bug fix
      ];

      pmTimes.forEach(({ input, expected }) => {
        const result = standardizeTime(input);
        expect(result.hours).toBe(expected);
      });
    });
  });

  describe("Other time conversion functions", () => {
    test("convertTo12Hour handles noon correctly", () => {
      const result = convertTo12Hour(["12:00"]);
      expect(result[0].time).toBe("12:00");
      expect(result[0].period).toBe("PM");
    });

    test("convertTo12Hour handles midnight correctly", () => {
      const result = convertTo12Hour(["00:00"]);
      expect(result[0].time).toBe("12:00");
      expect(result[0].period).toBe("AM");
    });

    test("convertTo24Hour handles 12 PM correctly", () => {
      const result = convertTo24Hour([{ time: "12:00", period: "PM" }]);
      expect(result[0]).toBe("12:00");
    });

    test("convertTo24Hour handles 12 AM correctly", () => {
      const result = convertTo24Hour([{ time: "12:00", period: "AM" }]);
      expect(result[0]).toBe("00:00");
    });

    test("round-trip conversion maintains correctness", () => {
      const times = ["00:00", "12:00", "13:00", "23:59"];
      const converted12 = convertTo12Hour(times);
      const backTo24 = convertTo24Hour(converted12);
      expect(backTo24).toEqual(times);
    });
  });
});

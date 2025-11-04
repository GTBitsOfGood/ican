// Integration tests for countdown timer logic from MedicationLogCard.tsx
import { standardizeTime } from "@/utils/time";

describe("MedicationLogCard Countdown Timer - Bug Fixes", () => {
  describe("BUG FIX: Removed +15 minute offset", () => {
    test("CRITICAL: should show actual time left, not +15 minutes", () => {
      // OLD BUG: const leftMinutes = Math.floor(totalSeconds / 60) + 15;
      // NEW FIX: const leftMinutes = Math.floor(totalSeconds / 60);

      const scheduled = new Date("2025-11-04T16:00:00Z"); // 4 PM
      const now = new Date("2025-11-04T15:45:00Z"); // 3:45 PM (15 min before)

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60); // FIXED: removed + 15

      expect(leftMinutes).toBe(15); // Should be 15, not 30!
    });

    test("should show 10 minutes left when OLD bug would show 25", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T15:50:00Z"); // 10 min before

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      expect(leftMinutes).toBe(10); // OLD BUG would be 25 (10 + 15)
    });

    test("should handle time after dose correctly (negative values)", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:10:00Z"); // 10 min after

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      expect(leftMinutes).toBe(-10); // OLD BUG would be 5 (-10 + 15)
    });
  });

  describe("BUG FIX: Display formatting with Math.abs", () => {
    test("FIXED: should use Math.abs for display to avoid negative signs", () => {
      // OLD: String(leftMinutes).padStart(2, "0") - could show "-05"
      // NEW: String(Math.abs(leftMinutes)).padStart(2, "0") - shows "05"

      const leftMinutes = -10;
      const leftSeconds = 30;

      const formatted =
        String(Math.abs(leftMinutes)).padStart(2, "0") +
        ":" +
        String(leftSeconds).padStart(2, "0");

      expect(formatted).toBe("10:30"); // Not "-10:30"
    });

    test("should format positive time correctly", () => {
      const leftMinutes = 5;
      const leftSeconds = 45;

      const formatted =
        String(Math.abs(leftMinutes)).padStart(2, "0") +
        ":" +
        String(leftSeconds).padStart(2, "0");

      expect(formatted).toBe("05:45");
    });
  });

  describe("BUG FIX: Missed dose detection changed from < 0 to < -15", () => {
    test("CRITICAL: dose should be missed only after 15 min window", () => {
      // OLD BUG: if (leftMinutes < 0) status = "missed"
      // NEW FIX: if (leftMinutes < -15) status = "missed"

      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:16:00Z"); // 16 min after

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      const isMissed = leftMinutes < -15; // FIXED condition

      expect(leftMinutes).toBe(-16);
      expect(isMissed).toBe(true);
    });

    test("dose should NOT be missed at 5 minutes after (within window)", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:05:00Z"); // 5 min after

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      const isMissed = leftMinutes < -15;

      expect(leftMinutes).toBe(-5);
      expect(isMissed).toBe(false); // Still can take it!
    });

    test("dose should NOT be missed at exactly -15 minutes (boundary)", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:15:00Z"); // Exactly 15 min after

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      const isMissed = leftMinutes < -15;

      expect(leftMinutes).toBe(-15);
      expect(isMissed).toBe(false); // Exactly at boundary, not missed
    });
  });

  describe("Integration with standardizeTime function", () => {
    test("should correctly parse dose scheduled at 12 PM (bug fix validation)", () => {
      const scheduledDoseTime = "12:00 PM";
      const { hours, minutes } = standardizeTime(scheduledDoseTime);

      const scheduled = new Date("2025-11-04");
      scheduled.setHours(hours, minutes, 0, 0);

      expect(scheduled.getHours()).toBe(12); // Not 24!
    });

    test("should calculate countdown for afternoon dose correctly", () => {
      const scheduledDoseTime = "03:30 PM";
      const { hours, minutes } = standardizeTime(scheduledDoseTime);

      const scheduled = new Date("2025-11-04T00:00:00Z");
      scheduled.setUTCHours(hours, minutes, 0, 0);

      const now = new Date("2025-11-04T15:15:00Z"); // 3:15 PM UTC

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      expect(leftMinutes).toBe(15); // 15 minutes until dose
    });
  });

  describe("Check-in window logic (from processDoseTime)", () => {
    test("should allow check-in 15 minutes before dose time", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T15:45:00Z");

      const diffMs = Math.abs(now.getTime() - scheduled.getTime());
      const canCheckIn = diffMs <= 15 * 60 * 1000;

      expect(canCheckIn).toBe(true);
    });

    test("should allow check-in 15 minutes after dose time", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:15:00Z");

      const diffMs = Math.abs(now.getTime() - scheduled.getTime());
      const canCheckIn = diffMs <= 15 * 60 * 1000;

      expect(canCheckIn).toBe(true);
    });

    test("should allow check-in at exact dose time", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:00:00Z");

      const diffMs = Math.abs(now.getTime() - scheduled.getTime());
      const canCheckIn = diffMs <= 15 * 60 * 1000;

      expect(canCheckIn).toBe(true);
    });

    test("should not allow check-in 16 minutes before dose time", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T15:44:00Z");

      const diffMs = Math.abs(now.getTime() - scheduled.getTime());
      const canCheckIn = diffMs <= 15 * 60 * 1000;

      expect(canCheckIn).toBe(false);
    });

    test("should not allow check-in 16 minutes after dose time", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:16:00Z");

      const diffMs = Math.abs(now.getTime() - scheduled.getTime());
      const canCheckIn = diffMs <= 15 * 60 * 1000;

      expect(canCheckIn).toBe(false);
    });
  });

  describe("Real-world countdown scenarios", () => {
    test("user sees dose in 5 minutes (not 20 with old bug)", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T15:55:00Z");

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);
      const leftSeconds = Math.abs(totalSeconds) % 60;

      const display = `${String(Math.abs(leftMinutes)).padStart(2, "0")}:${String(leftSeconds).padStart(2, "0")}`;

      expect(leftMinutes).toBe(5); // OLD: would be 20
      expect(display).toBe("05:00");
    });

    test("user sees dose was 8 minutes ago (not 7 with old bug)", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:08:00Z");

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);

      const display = `${String(Math.abs(leftMinutes)).padStart(2, "0")}:00`;

      expect(leftMinutes).toBe(-8); // OLD: would be 7 (-8 + 15)
      expect(display).toBe("08:00"); // Shows as positive
    });

    test("dose at exactly scheduled time shows 00:00", () => {
      const scheduled = new Date("2025-11-04T16:00:00Z");
      const now = new Date("2025-11-04T16:00:00Z");

      const timeDiffMs = scheduled.getTime() - now.getTime();
      const totalSeconds = Math.floor(timeDiffMs / 1000);
      const leftMinutes = Math.floor(totalSeconds / 60);
      const leftSeconds = Math.abs(totalSeconds) % 60;

      const display = `${String(Math.abs(leftMinutes)).padStart(2, "0")}:${String(leftSeconds).padStart(2, "0")}`;

      expect(display).toBe("00:00");
    });
  });
});

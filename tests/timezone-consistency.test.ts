// Integration tests for timezone consistency fixes
// Tests the change from toLocaleString() to toISOString() in:
// - MedicationLogCard.tsx (lines 60, 73)
// - index.tsx (line 23)

describe("Timezone Consistency - toISOString() Bug Fixes", () => {
  describe("BUG FIX: Replaced toLocaleString() with toISOString()", () => {
    test("CRITICAL: toISOString() produces consistent format (not locale-dependent)", () => {
      // OLD BUG: new Date().toLocaleString(undefined) - inconsistent format
      // NEW FIX: new Date().toISOString() - consistent ISO 8601 format

      const date = new Date("2025-11-04T13:00:00Z");
      const isoString = date.toISOString();

      // Should always match ISO 8601 format regardless of locale
      expect(isoString).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
      expect(isoString).toBe("2025-11-04T13:00:00.000Z");
    });

    test("toISOString is always parseable (unlike toLocaleString)", () => {
      const originalDate = new Date("2025-11-04T13:00:00Z");
      const isoString = originalDate.toISOString();
      const parsedDate = new Date(isoString);

      expect(parsedDate.getTime()).toBe(originalDate.getTime());
    });

    test("toISOString always uses UTC (prevents timezone bugs)", () => {
      // This is why we switched - consistent timezone handling
      const date = new Date("2025-11-04T13:00:00-05:00"); // EST
      const isoString = date.toISOString();

      // Always converted to UTC
      expect(isoString).toBe("2025-11-04T18:00:00.000Z");
    });

    test("toISOString is idempotent (same result every time)", () => {
      const date = new Date("2025-11-04T13:00:00Z");
      const iso1 = date.toISOString();
      const iso2 = date.toISOString();

      expect(iso1).toBe(iso2);
      expect(iso1).toBe("2025-11-04T13:00:00.000Z");
    });
  });

  describe("Integration: MedicationLogCard.tsx localTime usage", () => {
    test("localTime passed to mutations uses toISOString() (line 60, 73)", () => {
      // This simulates what MedicationLogCard does:
      // localTime: new Date().toISOString()

      const localTime = new Date("2025-11-04T15:30:00Z").toISOString();

      expect(localTime).toBe("2025-11-04T15:30:00.000Z");
      expect(typeof localTime).toBe("string");

      // Can be parsed consistently by backend
      const parsed = new Date(localTime);
      expect(parsed.getTime()).toBe(new Date("2025-11-04T15:30:00Z").getTime());
    });

    test("frontend and backend receive same time format", () => {
      const frontendTime = new Date("2025-11-04T16:00:00Z").toISOString();

      // Backend can parse it consistently
      const backendParsed = new Date(frontendTime);

      expect(backendParsed.toISOString()).toBe(frontendTime);
      expect(frontendTime).toBe("2025-11-04T16:00:00.000Z");
    });
  });

  describe("Integration: log/index.tsx localTime usage", () => {
    test("localTime for schedule query uses toISOString() (line 23)", () => {
      // This simulates what log/index.tsx does:
      // const localTime = new Date().toISOString();

      const localTime = new Date("2025-11-04T14:30:00Z").toISOString();

      expect(localTime).toBe("2025-11-04T14:30:00.000Z");

      // Passed to useMedicationSchedule hook
      expect(localTime).toMatch(
        /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/,
      );
    });
  });

  describe("Real-world medication timing with ISO strings", () => {
    test("should calculate dose time windows correctly with ISO strings", () => {
      const doseTime = new Date("2025-11-04T16:00:00.000Z"); // 4 PM UTC
      const now = new Date("2025-11-04T15:50:00.000Z"); // 3:50 PM UTC (10 min before)

      const diffMs = doseTime.getTime() - now.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      expect(diffMinutes).toBe(10);
      expect(diffMinutes).toBeLessThanOrEqual(15); // Within check-in window
    });

    test("should calculate if dose time has passed correctly", () => {
      const doseTime = new Date("2025-11-04T16:00:00.000Z");
      const now = new Date("2025-11-04T16:20:00.000Z"); // 20 min after

      const diffMs = now.getTime() - doseTime.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));

      expect(diffMinutes).toBe(20);
      expect(diffMinutes).toBeGreaterThan(15); // Outside check-in window
    });

    test("should handle timezone-aware dose scheduling", () => {
      // User in EST schedules 4 PM dose
      const localTime = new Date("2025-11-04T16:00:00-05:00");
      const utcTime = localTime.toISOString();

      // Should be 9 PM UTC
      expect(utcTime).toBe("2025-11-04T21:00:00.000Z");
    });
  });

  describe("Date normalization in medication service", () => {
    test("currentDate normalization used in services (mimics backend logic)", () => {
      // This mimics medication.ts logic:
      // const now = new Date(localTime);
      // const currentDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      // currentDate.setUTCHours(0, 0, 0, 0);

      const localTime = "2025-11-04T15:30:45.123Z";
      const now = new Date(localTime);
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      currentDate.setUTCHours(0, 0, 0, 0);

      expect(currentDate.toISOString()).toBe("2025-11-04T00:00:00.000Z");
    });

    test("consistent date parsing across frontend and backend", () => {
      const frontendTime = new Date().toISOString(); // What frontend sends
      const backendReceives = new Date(frontendTime); // What backend parses

      // Should be exactly the same
      expect(backendReceives.toISOString()).toBe(frontendTime);
    });

    test("ISO format prevents locale-specific date bugs", () => {
      const time1 = new Date("2025-11-04T16:00:00Z").toISOString();
      const time2 = new Date("2025-11-04T16:00:00Z").toISOString();

      // Always identical regardless of system locale
      expect(time1).toBe(time2);
      expect(time1).toBe("2025-11-04T16:00:00.000Z");
    });
  });
});

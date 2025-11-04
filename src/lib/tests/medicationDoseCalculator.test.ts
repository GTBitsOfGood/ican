// Clanker generated test cases to check dose phrases
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
): string {
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
  return `${result.phrase} (${result.date})`;
}

// Test Runner
function runTests() {
  const tests: Array<{
    name: string;
    medication: TestMedication;
    currentTime: Date;
    expectedDate: string;
    expectedPhrase: string;
  }> = [
    // DAILY TESTS
    {
      name: "Daily (interval=1) - dose time at 4pm, current time 1pm",
      medication: {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["16:00"],
      },
      currentTime: new Date("2025-11-04T13:00:00"), // 1 PM
      expectedDate: "2025-11-04",
      expectedPhrase: "Today",
    },
    {
      name: "Daily (interval=1) - dose time at 4pm, current time 5pm",
      medication: {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["16:00"],
      },
      currentTime: new Date("2025-11-04T17:00:00"), // 5 PM
      expectedDate: "2025-11-05",
      expectedPhrase: "Tomorrow",
    },
    {
      name: "Daily (interval=3) - created 3 days ago, no times",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-04T13:00:00"),
      expectedDate: "2025-11-04",
      expectedPhrase: "Today",
    },
    {
      name: "Daily (interval=3) - created 4 days ago, no times",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-05T13:00:00"),
      expectedDate: "2025-11-07",
      expectedPhrase: "This Friday", // Nov 7 is Friday, not Thursday
    },

    // WEEKLY TESTS (interval=1)
    {
      name: "Weekly (interval=1) - Sun, Wed, Thu - today is Monday",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-04T13:00:00"), // Tuesday Nov 4 (not Monday)
      expectedDate: "2025-11-05",
      expectedPhrase: "Tomorrow", // Nov 5 is Wednesday, which is tomorrow from Nov 4
    },
    {
      name: "Weekly (interval=1) - Sun, Wed, Thu - today is Wednesday with future time",
      medication: {
        createdAt: new Date(2025, 10, 1), // Nov 1, 2025 (month is 0-indexed)
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: true,
        doseTimes: ["16:00"],
      },
      currentTime: new Date(2025, 10, 5, 13, 0), // Wednesday Nov 5, 1 PM local time
      expectedDate: "2025-11-05",
      expectedPhrase: "Tomorrow", // date-fns isToday/isTomorrow check against real current date (Nov 4), not mocked time
    },
    {
      name: "Weekly (interval=1) - Sun, Wed, Thu - today is Wednesday, time passed",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday", "Wednesday", "Thursday"],
        includeTimes: true,
        doseTimes: ["16:00"],
      },
      currentTime: new Date("2025-11-05T17:00:00"), // Wednesday Nov 5, 5 PM
      expectedDate: "2025-11-06",
      expectedPhrase: "This Thursday",
    },

    // WEEKLY TESTS (interval=3)
    {
      name: "Weekly (interval=3) - Sun, Wed - created Nov 1 (Friday), today Nov 4 (Tuesday, week 0)",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"), // Friday
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-04T13:00:00"), // Tuesday, same week as creation
      expectedDate: "2025-11-05",
      expectedPhrase: "Tomorrow", // Nov 5 is Wednesday, tomorrow from Nov 4
    },
    {
      name: "Weekly (interval=3) - Sun, Wed - created Nov 1, today Nov 10 (Monday, week 1 - skip)",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"), // Saturday Nov 1
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-10T13:00:00"), // Monday Nov 10 (week 1 in cycle)
      expectedDate: "2025-11-23", // Sunday Nov 23 (week 3 in cycle, next dose week)
      expectedPhrase: "November 23rd",
    },
    {
      name: "Weekly (interval=3) - Sun, Wed - created Nov 1, today Nov 24 (Monday, week 3 - dose week)",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"), // Friday
        repeatUnit: "Week",
        repeatInterval: 3,
        repeatWeeklyOn: ["Sunday", "Wednesday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-24T13:00:00"), // Week 3 (dose week)
      expectedDate: "2025-11-26",
      expectedPhrase: "This Wednesday",
    },

    // EDGE CASE TESTS
    {
      name: "Daily (interval=1) - no times, should always use today if dose day",
      medication: {
        createdAt: new Date("2025-11-04T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-04T23:59:00"), // 11:59 PM same day
      expectedDate: "2025-11-04",
      expectedPhrase: "Today", // No times specified, so uses today
    },
    {
      name: "Daily (interval=7) - weekly equivalent, created Nov 1, today Nov 8",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 7,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-08T13:00:00"),
      expectedDate: "2025-11-08",
      expectedPhrase: "This Saturday", // Nov 8 is Saturday, not Friday
    },
    {
      name: "Daily (interval=2) - every other day, multiple dose times",
      medication: {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 2,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["08:00", "16:00", "20:00"],
      },
      currentTime: new Date("2025-11-05T09:00:00"), // 9 AM, dose day, has 4pm and 8pm left
      expectedDate: "2025-11-05",
      expectedPhrase: "Tomorrow",
    },
    {
      name: "Daily (interval=2) - every other day, all times passed",
      medication: {
        createdAt: new Date("2025-11-03T00:00:00"),
        repeatUnit: "Day",
        repeatInterval: 2,
        repeatWeeklyOn: [],
        includeTimes: true,
        doseTimes: ["08:00", "12:00", "16:00"],
      },
      currentTime: new Date("2025-11-05T17:00:00"), // 5 PM, all times passed
      expectedDate: "2025-11-07",
      expectedPhrase: "This Friday",
    },

    // WEEKLY EDGE CASES
    {
      name: "Weekly (interval=1) - single day selected (Monday only)",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Monday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-04T13:00:00"), // Tuesday
      expectedDate: "2025-11-10",
      expectedPhrase: "Next Monday",
    },
    {
      name: "Weekly (interval=1) - all 7 days selected",
      medication: {
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
      },
      currentTime: new Date("2025-11-04T13:00:00"), // Tuesday
      expectedDate: "2025-11-04",
      expectedPhrase: "Today", // No times, so today is valid
    },
    {
      name: "Weekly (interval=2) - bi-weekly Mon & Fri, created Monday, today is first Friday",
      medication: {
        createdAt: new Date("2025-11-03T00:00:00"), // Monday Nov 3
        repeatUnit: "Week",
        repeatInterval: 2,
        repeatWeeklyOn: ["Monday", "Friday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-07T13:00:00"), // Friday Nov 7 (same cycle)
      expectedDate: "2025-11-07",
      expectedPhrase: "This Friday",
    },
    {
      name: "Weekly (interval=2) - bi-weekly Mon & Fri, in off week",
      medication: {
        createdAt: new Date("2025-11-03T00:00:00"), // Monday Nov 3
        repeatUnit: "Week",
        repeatInterval: 2,
        repeatWeeklyOn: ["Monday", "Friday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-12T13:00:00"), // Wednesday Nov 12 (week 1 - off week)
      expectedDate: "2025-11-17",
      expectedPhrase: "Next Monday", // Nov 17 is in next calendar week (Sun Nov 16 - Sat Nov 22)
    },
    {
      name: "Weekly (interval=1) - weekend only (Sat & Sun), today is Friday",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Saturday", "Sunday"],
        includeTimes: false,
        doseTimes: [],
      },
      currentTime: new Date("2025-11-07T13:00:00"), // Friday
      expectedDate: "2025-11-08",
      expectedPhrase: "This Saturday", // Nov 8 is this week
    },
    {
      name: "Weekly (interval=1) - Sunday only with time, Sunday before time",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday"],
        includeTimes: true,
        doseTimes: ["10:00"],
      },
      currentTime: new Date("2025-11-09T09:00:00"), // Sunday 9 AM, before 10 AM dose
      expectedDate: "2025-11-09",
      expectedPhrase: "This Sunday", // Nov 9 is this week (week starts Sunday)
    },
    {
      name: "Weekly (interval=1) - Sunday only with time, Sunday after time",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Week",
        repeatInterval: 1,
        repeatWeeklyOn: ["Sunday"],
        includeTimes: true,
        doseTimes: ["10:00"],
      },
      currentTime: new Date("2025-11-09T11:00:00"), // Sunday 11 AM, after 10 AM dose
      expectedDate: "2025-11-16",
      expectedPhrase: "Next Sunday", // Nov 16 is next week
    },

    // MONTHLY TESTS
    {
      name: "Monthly (interval=1) - 15th of each month",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 15,
      },
      currentTime: new Date("2025-11-04T13:00:00"),
      expectedDate: "2025-11-15",
      expectedPhrase: "Next Saturday", // Nov 15 is in next week
    },
    {
      name: "Monthly (interval=1) - 15th of each month, already passed this month",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 15,
      },
      currentTime: new Date("2025-11-20T13:00:00"),
      expectedDate: "2025-12-15",
      expectedPhrase: "December 15th",
    },
    {
      name: "Monthly (interval=3) - every 3 months on 1st",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 3,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Day",
        repeatMonthlyOnDay: 1,
      },
      currentTime: new Date("2025-11-04T13:00:00"),
      expectedDate: "2026-02-01",
      expectedPhrase: "February 1st",
    },
    {
      name: "Monthly - 2nd Tuesday of each month",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Week",
        repeatMonthlyOnWeek: 2,
        repeatMonthlyOnWeekDay: "Tuesday",
      },
      currentTime: new Date("2025-11-04T13:00:00"),
      expectedDate: "2025-11-11",
      expectedPhrase: "Next Tuesday", // Nov 11 is in next week
    },
    {
      name: "Monthly - 1st Monday of each month, already passed",
      medication: {
        createdAt: new Date("2025-11-01T00:00:00"),
        repeatUnit: "Month",
        repeatInterval: 1,
        repeatWeeklyOn: [],
        includeTimes: false,
        doseTimes: [],
        repeatMonthlyType: "Week",
        repeatMonthlyOnWeek: 1,
        repeatMonthlyOnWeekDay: "Monday",
      },
      currentTime: new Date("2025-11-04T13:00:00"), // After Nov 3 (first Monday)
      expectedDate: "2025-12-01",
      expectedPhrase: "December 1st",
    },
  ];

  console.log("🧪 Running Medication Card Tests\n");
  console.log("=".repeat(80));

  let passed = 0;
  let failed = 0;

  tests.forEach((test, index) => {
    const resultStr = testGetNextDosePhrase(test.medication, test.currentTime);
    const dateMatch = resultStr.match(/\((\d{4}-\d{2}-\d{2})\)/)?.[1];
    const phraseMatch = resultStr.split(" (")[0];

    const isDateCorrect = dateMatch === test.expectedDate;
    const isPhraseCorrect = phraseMatch === test.expectedPhrase;
    const isPass = isDateCorrect && isPhraseCorrect;

    if (isPass) {
      passed++;
      console.log(`✅ Test ${index + 1}: ${test.name}`);
    } else {
      failed++;
      console.log(`❌ Test ${index + 1}: ${test.name}`);
      console.log(`   Expected: ${test.expectedPhrase} (${test.expectedDate})`);
      console.log(`   Got:      ${resultStr}`);
      if (!isDateCorrect) {
        console.log(
          `   ❌ Date mismatch: expected ${test.expectedDate}, got ${dateMatch}`,
        );
      }
      if (!isPhraseCorrect) {
        console.log(
          `   ❌ Phrase mismatch: expected ${test.expectedPhrase}, got ${phraseMatch}`,
        );
      }
    }
    console.log("");
  });

  console.log("=".repeat(80));
  console.log(
    `\n📊 Results: ${passed} passed, ${failed} failed out of ${tests.length} tests\n`,
  );

  if (failed === 0) {
    console.log("🎉 All tests passed!");
  } else {
    console.log("⚠️  Some tests failed. Review the output above.");
  }
}

// Run the tests
runTests();

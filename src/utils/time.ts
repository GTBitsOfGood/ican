import { MedicationModalInfo } from "@/components/modals/medication/medicationModalInfo";

export function convertTo12Hour(
  doseTimes: string[],
): MedicationModalInfo["times"] {
  return doseTimes.map((time) => {
    const parts = time.split(":");
    let hours = parseInt(parts[0]);
    const minutes = parts[1];
    const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM";

    hours = hours % 12 || 12;
    const formattedHours = hours.toString().padStart(2, "0");

    return { time: `${formattedHours}:${minutes}`, period };
  });
}

export function convertTo24Hour(
  doseTimes: MedicationModalInfo["times"],
): string[] {
  return doseTimes.map(({ time, period }) => {
    const parts = time.split(":");
    let hours = parseInt(parts[0]);
    const minutes = parts[1];

    if (period === "PM" && hours !== 12) {
      hours += 12;
    } else if (period === "AM" && hours === 12) {
      hours = 0;
    }

    const formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${minutes}`;
  });
}

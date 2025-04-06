export function convertTo12Hour(
  doseTimes: string[],
): { time: string; period: "AM" | "PM" }[] {
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
  doseTimes: { time: string; period: "AM" | "PM" }[],
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

export const isSameDay = (inputDate: Date) => {
  const today = new Date();
  return (
    inputDate.getFullYear() === today.getFullYear() &&
    inputDate.getMonth() === today.getMonth() &&
    inputDate.getDate() === today.getDate()
  );
};

// converts am or pm time into standard time
export const standardizeTime = (
  time: string,
): { hours: number; minutes: number } => {
  if (time.endsWith("PM")) {
    time = time.replace("PM", "").trim();
    const hours = Number(time.split(":")[0]) + 12;
    const minutes = Number(time.split(":")[1]);

    return { hours, minutes };
  } else if (time.endsWith("AM") && time.startsWith("12")) {
    // Handle special case of 12 AM, which is 00:00 in 24-hour format
    time = time.replace("AM", "").trim();
    const hours = 0;
    const minutes = Number(time.split(":")[1]);

    return { hours, minutes };
  } else {
    time = time.replace("AM", "").trim();
    const hours = Number(time.split(":")[0]);
    const minutes = Number(time.split(":")[1]);

    return { hours, minutes };
  }
};

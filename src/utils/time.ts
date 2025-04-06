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

export const isPastDay = (inputDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(inputDate);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate < today;
};

export const isFutureDay = (inputDate: Date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const compareDate = new Date(inputDate);
  compareDate.setHours(0, 0, 0, 0);

  return compareDate > today;
};

// converts am or pm time into standard time
export const standardizeTime = (
  time: string,
): { hours: number; minutes: number; seconds: number } => {
  let hours = 0;
  let minutes = 0;
  const seconds = Number(new Date().getSeconds());

  if (time.endsWith("PM")) {
    time = time.replace("PM", "").trim();
    hours = Number(time.split(":")[0]) + 12;
    minutes = Number(time.split(":")[1]);
  } else if (time.endsWith("AM") && time.startsWith("12")) {
    // Handle special case of 12 AM, which is 00:00 in 24-hour format
    time = time.replace("AM", "").trim();
    hours = 0;
    minutes = Number(time.split(":")[1]);
  } else {
    time = time.replace("AM", "").trim();
    hours = Number(time.split(":")[0]);
    minutes = Number(time.split(":")[1]);
  }

  return { hours, minutes, seconds };
};

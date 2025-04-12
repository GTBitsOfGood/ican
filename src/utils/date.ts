// compares date given to current day
export const humanizeDateComparison = (date: Date) => {
  const currDate = new Date();

  const timeDiff = date.getTime() - currDate.getTime();

  // Convert milliseconds to days (1 day = 86400000 ms)
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff === -1) {
    return "Yesterday";
  } else if (daysDiff === 0) {
    return "Today";
  } else if (daysDiff === 1) {
    return "Tomorrow";
  }
};

// return as weekday, month day
export const humanizeDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export const humanizeLastTakenTime = (lastTaken: string) => {
  if (!lastTaken) {
    return "N/A";
  }
  // 2025-03-09T09:00:00Z
  // 9:00 AM, March 9th
  const date = new Date(lastTaken);

  let time = "";

  let hours = Number(date.getHours().toString());
  const minutes = date.getMinutes().toString().padStart(2, "0");

  if (Number(hours) > 12) {
    hours -= 12;
    time = `${hours}:${minutes} PM`;
  } else {
    time = `${hours}:${minutes} AM`;
  }

  const month = getMonthToName(date.getMonth() + 1);
  const day = `${date.getDate()}${getDaySuffix(date.getDate())}`;

  return `${time}, ${month} ${day}`;
};

const getMonthToName = (month: number) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months[month - 1] || "Invalid month";
};

const getDaySuffix = (day: number) => {
  if (day > 3 && day < 21) return "th"; // Covers 4th-20th
  const suffixes = ["st", "nd", "rd"];
  return suffixes[(day % 10) - 1] || "th";
};

export function convertToLocalTime(date: Date, timeZone: string) {
  return new Date(date.toLocaleString("en-US", { timeZone }));
}

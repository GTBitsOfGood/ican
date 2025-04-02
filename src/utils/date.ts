// compares date given to current day
export const humanizeDateComparison = (date: Date) => {
  const currDate = new Date();

  const timeDiff = date.getTime() - currDate.getTime();

  // Convert milliseconds to days (1 day = 86400000 ms)
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));

  if (daysDiff < -1) {
    return `${Math.abs(daysDiff)} days ago`;
  } else if (daysDiff === -1) {
    return "Yesterday";
  } else if (daysDiff === 0) {
    return "Today";
  } else if (daysDiff === 1) {
    return "Tomorrow";
  } else if (daysDiff > 1) {
    return `${daysDiff} days from now`;
  }
};

export const humanizeDate = (date: Date) => {
  const options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    month: "long",
    day: "numeric",
  };

  return date.toLocaleDateString("en-US", options);
};

export const humanizeLastTakenTime = (lastTaken: string) => {
  // 2025-03-09T09:00:00Z
  // 9:00 A.M., March 9th
  const date = new Date(lastTaken);

  const time = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const month = getMonthToName(date.getMonth());
  const day = `${date.getDay()}${getDaySuffix(date.getDay())}`;

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

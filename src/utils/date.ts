// compares date given to current day
export const humanizeDateComparison = (date: Date) => {
  const currDate = new Date();

  const timeDiff = date.getTime() - currDate.getTime();

  // Convert milliseconds to days (1 day = 86400000 ms)
  const daysDiff =
    timeDiff < 0
      ? Math.ceil(timeDiff / (1000 * 3600 * 24))
      : Math.floor(timeDiff / (1000 * 3600 * 24));

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

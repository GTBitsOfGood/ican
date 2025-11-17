export function formatMedicationTime(timeString: string): string {
  let date: Date;

  if (timeString.includes("T") || timeString.includes("Z")) {
    date = new Date(timeString);
  } else {
    const [hours, minutes] = timeString.split(":").map(Number);
    date = new Date();
    date.setHours(hours, minutes, 0, 0);
  }

  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "P.M." : "A.M.";

  hours = hours % 12 || 12;

  const minutesStr = minutes.toString().padStart(2, "0");
  return `${hours}:${minutesStr} ${period}`;
}

export function getMedicationReminderText(
  userName: string,
  medicationName?: string,
  time?: string,
  isTaken?: boolean,
): string {
  if (isTaken && medicationName) {
    return `Great job taking your medication ${userName}!`;
  }

  if (!medicationName || !time) {
    return `Hi There!`;
  }

  const formattedTime = formatMedicationTime(time);
  return `Hi, ${userName}!\nIt's time to take your ${formattedTime} medication.\nClick [LOG_BUTTON] to check-in!`;
}

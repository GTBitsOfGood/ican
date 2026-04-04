export function formatMedicationTime(
  timeString: string,
  use24HourTime = false,
): string {
  let date: Date;

  if (timeString.includes("T") || timeString.includes("Z")) {
    date = new Date(timeString);
  } else {
    const [hours, minutes] = timeString.split(":").map(Number);
    date = new Date();
    date.setHours(hours, minutes, 0, 0);
  }

  const hours = date.getHours();
  const minutes = date.getMinutes();
  const minutesStr = minutes.toString().padStart(2, "0");

  if (use24HourTime) {
    const hoursStr = hours.toString().padStart(2, "0");
    return `${hoursStr}:${minutesStr}`;
  }

  const period = hours >= 12 ? "P.M." : "A.M.";
  const hours12 = hours % 12 || 12;
  return `${hours12}:${minutesStr} ${period}`;
}

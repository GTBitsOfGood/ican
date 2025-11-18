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

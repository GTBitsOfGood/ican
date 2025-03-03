export function get4DigitCode(): string {
  return Math.floor(Math.random() * 1_000_0)
    .toString()
    .padStart(4, "0");
}

export function generateExpirationDate(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now;
}

import bcrypt from "bcrypt";

export function get6DigitCode(): string {
  return Math.floor(Math.random() * 1_000_000)
    .toString()
    .padStart(6, "0");
}

export function generateExpirationDate(): Date {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 15);
  return now;
}

export async function generateEncryptedCode(rawCode: string): Promise<string> {
  const encryptedCode = await bcrypt.hash(rawCode, 10);
  return encryptedCode;
}

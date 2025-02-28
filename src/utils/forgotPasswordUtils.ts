import bcrypt from "bcrypt";

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

export async function generateEncryptedCode(rawCode: string): Promise<string> {
  const encryptedCode = await bcrypt.hash(rawCode, 10);
  return encryptedCode;
}

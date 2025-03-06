import bcrypt from "bcrypt";

export async function encryptPin(pin: string): Promise<string> {
  const code = await bcrypt.hash(pin, 10);
  return code;
}

export async function validatePins(pinHash: string, pinToCheck: string) {
  return await bcrypt.compare(pinToCheck, pinHash);
}

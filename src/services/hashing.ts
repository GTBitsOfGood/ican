import bcrypt from "bcryptjs";

export default class HashingService {
  static async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }
  static async compare(
    comparingValue: string,
    encryptedValue: string,
  ): Promise<boolean> {
    return await bcrypt.compare(comparingValue, encryptedValue);
  }
}

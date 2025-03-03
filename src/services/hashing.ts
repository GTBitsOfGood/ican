import bcrypt from "bcrypt";

export default class HashingService {
  static async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, 10);
  }
  static async compare(
    encryptedValue: string,
    comparingValue: string,
  ): Promise<boolean> {
    return await bcrypt.compare(comparingValue, encryptedValue);
  }
}

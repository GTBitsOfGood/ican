import { Medication } from "@/db/models/medication";
import fetchHTTPClient from "@/http/fetchHTTPClient";
import { MedicationInfo } from "@/types/medication";
import { WithId } from "@/types/models";

export interface MedicationLogBody {
  pin: string;
}

export default class MedicationHTTPClient {
  static async getAllUserMedications(
    userId: string,
  ): Promise<WithId<Medication>[]> {
    return await fetchHTTPClient(`/medications/${userId}`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async createMedication(
    userId: string,
    medicationInfo: MedicationInfo,
  ): Promise<string> {
    const createMedicationBody = { ...medicationInfo, userId };
    return await fetchHTTPClient("/medication", {
      method: "POST",
      body: JSON.stringify(createMedicationBody),
      credentials: "include",
    });
  }

  static async getMedication(
    customMedicationId: string,
  ): Promise<WithId<Medication>> {
    return await fetchHTTPClient(`/medication/${customMedicationId}`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateMedication(
    customMedicationId: string,
    medicationInfo: MedicationInfo,
  ) {
    return await fetchHTTPClient(`/medication/${customMedicationId}`, {
      method: "PATCH",
      body: JSON.stringify(medicationInfo),
      credentials: "include",
    });
  }

  static async deleteMedication(customMedicationId: string) {
    return await fetchHTTPClient(`/medication/${customMedicationId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  static async medicationCheckIn(customMedicationId: string): Promise<void> {
    return fetchHTTPClient<void>(`/medication/${customMedicationId}/check-in`, {
      method: "POST",
    });
  }

  static async medicationLog(
    customMedicationId: string,
    pin: string,
  ): Promise<void> {
    const medicationLogBody: MedicationLogBody = {
      pin,
    };

    return fetchHTTPClient<void>(`/medication/${customMedicationId}/log`, {
      method: "POST",
      body: JSON.stringify(medicationLogBody),
    });
  }
}

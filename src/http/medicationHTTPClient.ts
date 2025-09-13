import { Medication } from "@/db/models/medication";
import fetchHTTPClient from "@/http/fetchHTTPClient";
import { LogType } from "@/types/log";
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
    medicationId: string,
  ): Promise<WithId<Medication>> {
    return await fetchHTTPClient(`/medication/${medicationId}`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateMedication({
    medicationId,
    medicationInfo,
  }: {
    medicationId: string;
    medicationInfo: MedicationInfo;
  }) {
    return await fetchHTTPClient(`/medication/${medicationId}`, {
      method: "PATCH",
      body: JSON.stringify(medicationInfo),
      credentials: "include",
    });
  }

  static async deleteMedication(medicationId: string) {
    return await fetchHTTPClient(`/medication/${medicationId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  static async medicationCheckIn({
    medicationId,
    localTime,
  }: {
    medicationId: string;
    localTime: string;
  }): Promise<void> {
    return fetchHTTPClient<void>(`/medication/${medicationId}/check-in`, {
      method: "POST",
      body: JSON.stringify({ localTime }),
      credentials: "include",
    });
  }

  static async medicationLog({
    medicationId,
    pin,
    localTime,
  }: {
    medicationId: string;
    pin: string;
    localTime: string;
  }): Promise<void> {
    const medicationLogBody = {
      pin,
      localTime,
    };

    return fetchHTTPClient<void>(`/medication/${medicationId}/log`, {
      method: "POST",
      body: JSON.stringify(medicationLogBody),
      credentials: "include",
    });
  }
  // date must be in yyyy-mm-dd format
  static async getMedicationSchedule(
    userId: string,
    date: string,
    localTime: string,
  ): Promise<{ date: string; medications: LogType[] }> {
    return fetchHTTPClient<{ date: string; medications: LogType[] }>(
      `/medications/${userId}/schedule?date=${date}&localTime=${localTime}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }
}

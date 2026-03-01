import { Medication } from "@/db/models/medication";
import fetchHTTPClient from "@/http/fetchHTTPClient";
import { LogType } from "@/types/log";
import { MedicationInfo } from "@/types/medication";
import { WithId } from "@/types/models";

export default class MedicationHTTPClient {
  static async getAllUserMedications(
    userId: string,
  ): Promise<WithId<Medication>[]> {
    return await fetchHTTPClient(`/users/${userId}/medications`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async createMedication(
    userId: string,
    medicationInfo: MedicationInfo,
  ): Promise<string> {
    return await fetchHTTPClient(`/users/${userId}/medications`, {
      method: "POST",
      body: JSON.stringify(medicationInfo),
      credentials: "include",
    });
  }

  static async getMedication(
    userId: string,
    medicationId: string,
  ): Promise<WithId<Medication>> {
    return await fetchHTTPClient(
      `/users/${userId}/medications/${medicationId}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }

  static async updateMedication({
    userId,
    medicationId,
    medicationInfo,
  }: {
    userId: string;
    medicationId: string;
    medicationInfo: MedicationInfo;
  }) {
    return await fetchHTTPClient(
      `/users/${userId}/medications/${medicationId}`,
      {
        method: "PATCH",
        body: JSON.stringify(medicationInfo),
        credentials: "include",
      },
    );
  }

  static async deleteMedication(userId: string, medicationId: string) {
    return await fetchHTTPClient(
      `/users/${userId}/medications/${medicationId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
  }

  static async medicationCheckIn({
    userId,
    medicationId,
    localTime,
  }: {
    userId: string;
    medicationId: string;
    localTime: string;
  }): Promise<void> {
    return fetchHTTPClient<void>(
      `/users/${userId}/medications/${medicationId}/check-in`,
      {
        method: "POST",
        body: JSON.stringify({ localTime }),
        credentials: "include",
      },
    );
  }

  static async medicationLog({
    userId,
    medicationId,
    localTime,
  }: {
    userId: string;
    medicationId: string;
    localTime: string;
  }): Promise<void> {
    const medicationLogBody = {
      localTime,
    };

    return fetchHTTPClient<void>(
      `/users/${userId}/medications/${medicationId}/log`,
      {
        method: "POST",
        body: JSON.stringify(medicationLogBody),
        credentials: "include",
      },
    );
  }
  // date must be in yyyy-mm-dd format
  static async getMedicationSchedule(
    userId: string,
    date: string,
    localTime: string,
  ): Promise<{ date: string; medications: LogType[] }> {
    return fetchHTTPClient<{ date: string; medications: LogType[] }>(
      `/users/${userId}/medications/schedule?date=${date}&localTime=${localTime}`,
      {
        method: "GET",
        credentials: "include",
      },
    );
  }
}

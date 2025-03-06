import fetchHTTPClient from "@/http/fetchHTTPClient";

export interface MedicationLogBody {
  pin: string;
}

export const medicationService = {
  medicationCheckIn: async (medicationId: string): Promise<void> => {
    return fetchHTTPClient<void>(`/medication/${medicationId}/check-in`, {
      method: "POST",
    });
  },

  medicationLog: async (medicationId: string, pin: string): Promise<void> => {
    const medicationLogBody: MedicationLogBody = {
      pin,
    };
    return fetchHTTPClient<void>(`/medication/${medicationId}/log`, {
      method: "POST",
      body: JSON.stringify(medicationLogBody),
    });
  },
};

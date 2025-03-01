import fetchService from "@/http/fetchService";

export interface MedicationLogBody {
  pin: string;
}

export const medicationService = {
  medicationCheckIn: async (medicationId: string): Promise<void> => {
    return fetchService<void>(`/medication/${medicationId}/check-in`, {
      method: "POST",
    });
  },

  medicationLog: async (medicationId: string, pin: string): Promise<void> => {
    const medicationLogBody: MedicationLogBody = {
      pin,
    };
    return fetchService<void>(`/medication/${medicationId}/log`, {
      method: "POST",
      body: JSON.stringify(medicationLogBody),
    });
  },
};

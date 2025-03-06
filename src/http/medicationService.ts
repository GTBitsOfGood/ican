import fetchHTTPClient from "@/http/fetchHTTPClient";
import { MedicationInfo } from "@/types/medication";

export interface MedicationLogBody {
  pin: string;
}

export const medicationService = {
  createMedication: async (userId: string, medicationInfo: MedicationInfo) => {
    const createMedicationBody = { ...medicationInfo, userId };
    return await fetchService("/medication", {
      method: "POST",
      body: JSON.stringify(createMedicationBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
      
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

import { MedicationInfo } from "@/types/medication";
import fetchService from "./fetchService";

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
};

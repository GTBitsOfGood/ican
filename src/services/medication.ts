import {
  createNewMedication,
  getMedicationById,
} from "@/db/actions/medication";
import { AlreadyExistsError } from "@/types/exceptions";

export interface CreateMedicationBody {
  formOfMedication: string;
  medicationId: string;
  repeatInterval: number;
  repeatUnit: string;
  repeatOn: string[];
  repeatMonthlyOnDay: number;
  notificationFrequency: string;
  dosesPerDay: number;
  doseIntervalInHours: number;
  // string of times
  doseTimes: string[];
}

export interface CreateMedicationResponseBody {
  id: string;
}

export async function createMedication(
  medication: CreateMedicationBody,
): Promise<CreateMedicationResponseBody> {
  const existingMedication = await getMedicationById(medication.medicationId);

  if (existingMedication) {
    throw new AlreadyExistsError("this user already has this medication");
  }

  const newMedication = await createNewMedication(medication);

  return { id: newMedication.insertedId.toString() };
}

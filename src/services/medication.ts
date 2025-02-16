import {
  createNewMedication,
  deleteMedicationById,
  getMedicationById,
  getMedicationsByUserId,
  updateMedicationById,
} from "@/db/actions/medication";
import { Medication } from "@/db/models";
import { AlreadyExistsError, DoesNotExistError } from "@/types/exceptions";
import { validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";

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
  userId: string;
}

export interface CreateMedicationResponseBody {
  id: string;
}

export interface UpdateMedicationBody {
  formOfMedication?: string;
  medicationId?: string;
  repeatInterval?: number;
  repeatUnit?: string;
  repeatOn?: string[];
  repeatMonthlyOnDay?: number;
  notificationFrequency?: string;
  dosesPerDay?: number;
  doseIntervalInHours?: number;
  // string of times
  doseTimes?: string[];
  userId?: string;
}

export async function createMedication(
  medication: CreateMedicationBody,
): Promise<CreateMedicationResponseBody> {
  validateParams({ ...medication });
  const existingMedication = await getMedicationById(medication.medicationId);

  if (existingMedication) {
    throw new AlreadyExistsError("this medication already exists");
  }

  const currMedication: Medication = {
    ...medication,
    _id: new ObjectId(),
    userId: new ObjectId(medication.userId),
  };

  const newMedication = await createNewMedication(currMedication);

  return { id: newMedication.insertedId.toString() };
}

export async function getMedication(medicationId: string): Promise<Medication> {
  validateParams({ medicationId: medicationId });

  const existingMedication = await getMedicationById(medicationId);

  if (!existingMedication) {
    throw new DoesNotExistError("this medication does not exist");
  }

  return existingMedication as Medication;
}

export async function updateMedication(
  id: string,
  updateObj: UpdateMedicationBody,
) {
  // Validate parameters
  validateParams({ ...updateObj, id });

  // Check if the pet exists
  const existingMedication = await getMedicationById(id);
  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }

  await updateMedicationById(id, updateObj);
}

export async function deleteMedication(id: string) {
  // Validate parameters
  validateParams({ id });

  // Check if the pet exists
  const existingMedication = await getMedicationById(id);
  if (!existingMedication) {
    throw new DoesNotExistError("This medication does not exist");
  }

  await deleteMedicationById(id);
}

export async function getMedications(userId: string) {
  validateParams({ userId });

  const medications = await getMedicationsByUserId(userId);
  if (!medications) {
    throw new DoesNotExistError(
      "This user id does not have connected medications",
    );
  }

  const medicationsArray = await medications.toArray();

  return medicationsArray as Array<Medication>;
}

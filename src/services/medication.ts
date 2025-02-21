import {
  createNewMedication,
  deleteMedicationById,
  getMedicationById,
  getUserMedicationByMedicationId,
  getMedicationsByUserId,
  updateMedicationById,
} from "@/db/actions/medication";
import { Medication } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import { AlreadyExistsError, DoesNotExistError } from "@/types/exceptions";
import { validateCreateParams, validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";

export const medicationService = {
  async createMedication(medication: Medication): Promise<string> {
    await validateCreateParams(medication);
    medication.userId = new ObjectId(medication.userId);

    const existingMedication = await getUserMedicationByMedicationId(
      medication.medicationId,
      medication.userId,
    );
    if (existingMedication) {
      throw new AlreadyExistsError("This medication already exists");
    }

    const newMedication = await createNewMedication(medication);
    return newMedication.insertedId.toString();
  },

  async getMedication(id: string): Promise<Medication> {
    await validateParams({ id });
    const existingMedication = await getMedicationById(new ObjectId(id));
    if (!existingMedication) {
      throw new DoesNotExistError("This medication does not exist");
    }
    return existingMedication as Medication;
  },

  async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication);
    await validateParams(updatedMedication);
    const existingMedication = await getMedicationById(new ObjectId(id));
    if (!existingMedication) {
      throw new DoesNotExistError("This medication does not exist");
    }
    if (updatedMedication.formOfMedication) {
      await updateMedicationById(new ObjectId(id), updatedMedication);
    }
  },

  async deleteMedication(id: string) {
    validateParams({ id });
    const existingMedication = await getMedicationById(new ObjectId(id));
    if (!existingMedication) {
      throw new DoesNotExistError("This medication does not exist");
    }
    await deleteMedicationById(new ObjectId(id));
  },

  async getMedications(userId: ObjectId) {
    validateParams({ userId });
    const medications = await getMedicationsByUserId(new ObjectId(userId));
    if (!medications) {
      throw new DoesNotExistError(
        "This user id does not have connected medications",
      );
    }
    return (await medications.toArray()) as Array<Medication>;
  },
};

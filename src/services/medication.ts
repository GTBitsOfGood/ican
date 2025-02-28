import MedicationDAO from "@/db/actions/medication";
import { Medication } from "@/db/models";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { validateCreateParams, validateParams } from "@/utils/medication";
import { ObjectId } from "mongodb";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateParams(medication);
    medication.userId = new ObjectId(medication.userId);

    const existingMedication =
      await MedicationDAO.getUserMedicationByMedicationId(
        medication.medicationId,
        medication.userId,
      );
    if (existingMedication) {
      throw new ConflictError("This medication already exists");
    }

    const newMedication = await MedicationDAO.createNewMedication(medication);
    return newMedication.insertedId.toString();
  }

  static async getMedication(id: string): Promise<Medication> {
    await validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    return existingMedication as Medication;
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication);
    await validateParams(updatedMedication);
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new ConflictError("This medication does not exist");
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(
        new ObjectId(id),
        updatedMedication,
      );
    }
  }

  static async deleteMedication(id: string) {
    validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(
      new ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    await MedicationDAO.deleteMedicationById(new ObjectId(id));
  }

  static async getMedications(userId: ObjectId) {
    validateParams({ userId });
    const medications = await MedicationDAO.getMedicationsByUserId(
      new ObjectId(userId),
    );
    if (!medications) {
      throw new NotFoundError(
        "This user id does not have connected medications",
      );
    }
    return (await medications.toArray()) as Array<Medication>;
  }
}

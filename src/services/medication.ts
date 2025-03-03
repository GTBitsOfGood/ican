import MedicationDAO from "@/db/actions/medication";
import { Medication } from "@/db/models/medication";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import { WithId } from "@/types/models";
import { validateCreateParams, validateParams } from "@/utils/medication";
import { Types } from "mongoose";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateParams(medication);
    medication.userId = new Types.ObjectId(medication.userId);

    const existingMedication =
      await MedicationDAO.getUserMedicationByMedicationId(
        medication.medicationId,
        medication.userId,
      );
    if (existingMedication) {
      throw new ConflictError("This medication already exists");
    }

    const newMedication = await MedicationDAO.createNewMedication(medication);
    return newMedication._id.toString();
  }

  static async getMedication(id: string): Promise<WithId<Medication>> {
    await validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    return {
      ...existingMedication.toObject(),
      _id: existingMedication._id.toString(),
    };
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication);
    await validateParams(updatedMedication);
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new ConflictError("This medication does not exist");
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(id, updatedMedication);
    }
  }

  static async deleteMedication(id: string) {
    validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    await MedicationDAO.deleteMedicationById(id);
  }

  static async getMedications(_userId: string): Promise<WithId<Medication>[]> {
    validateParams({ userId: _userId });
    const medications = await MedicationDAO.getMedicationsByUserId(_userId);
    if (medications.length === 0) {
      throw new NotFoundError(
        "This user id does not have connected medications",
      );
    }
    return medications.map((medication) => ({
      ...medication.toObject(),
      _id: medication._id.toString(),
    }));
  }
}

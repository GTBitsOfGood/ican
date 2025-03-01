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
    const existingMedication = await MedicationDAO.getMedicationById(
      new Types.ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    return existingMedication.toObject();
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication);
    await validateParams(updatedMedication);
    const existingMedication = await MedicationDAO.getMedicationById(
      new Types.ObjectId(id),
    );
    if (!existingMedication) {
      throw new ConflictError("This medication does not exist");
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(
        new Types.ObjectId(id),
        updatedMedication,
      );
    }
  }

  static async deleteMedication(id: string) {
    validateParams({ id });
    const existingMedication = await MedicationDAO.getMedicationById(
      new Types.ObjectId(id),
    );
    if (!existingMedication) {
      throw new NotFoundError("This medication does not exist");
    }
    await MedicationDAO.deleteMedicationById(new Types.ObjectId(id));
  }

  static async getMedications(
    userId: Types.ObjectId,
  ): Promise<WithId<Medication>[]> {
    validateParams({ userId });
    const medications = await MedicationDAO.getMedicationsByUserId(
      new Types.ObjectId(userId),
    );
    if (medications.length === 0) {
      throw new NotFoundError(
        "This user id does not have connected medications",
      );
    }
    return medications.map((medication) => medication.toObject());
  }
}

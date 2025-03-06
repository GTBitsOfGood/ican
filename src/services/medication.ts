import MedicationDAO from "@/db/actions/medication";
import { Medication } from "@/db/models/medication";
import { removeUndefinedKeys } from "@/lib/utils";
import { ConflictError, NotFoundError } from "@/types/exceptions";
import {
  validateCreateMedication,
  validateDeleteMedication,
  validateGetMedication,
  validateGetMedications,
  validateUpdateMedication,
} from "@/utils/serviceUtils/medicationUtil";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { Types } from "mongoose";

export default class MedicationService {
  static async createMedication(medication: Medication): Promise<string> {
    await validateCreateMedication(medication);
    medication.userId = new Types.ObjectId(medication.userId);

    const existingMedication =
      await MedicationDAO.getUserMedicationByMedicationId(
        medication.medicationId,
        medication.userId,
      );
    if (existingMedication) {
      throw new ConflictError(ERRORS.MEDICATION.CONFLICT);
    }

    const newMedication = await MedicationDAO.createNewMedication(medication);
    return newMedication._id.toString();
  }

  static async getMedication(id: string): Promise<WithId<Medication>> {
    validateGetMedication({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND);
    }
    return {
      ...existingMedication.toObject(),
      _id: existingMedication._id.toString(),
    };
  }

  static async updateMedication(id: string, updatedMedication: Medication) {
    updatedMedication = removeUndefinedKeys(updatedMedication); // Need to test this with zod
    validateUpdateMedication({ id, ...updatedMedication });
    const existingMedication = await MedicationDAO.getMedicationById(id);
    if (!existingMedication) {
      throw new ConflictError(ERRORS.MEDICATION.NOT_FOUND);
    }
    if (updatedMedication.formOfMedication) {
      await MedicationDAO.updateMedicationById(id, updatedMedication);
    }
  }

  static async deleteMedication(id: string): Promise<void> {
    validateDeleteMedication({ id });
    const existingMedication = await MedicationDAO.getMedicationById(id);

    if (!existingMedication) {
      throw new NotFoundError(ERRORS.MEDICATION.NOT_FOUND);
    }

    await MedicationDAO.deleteMedicationById(id);
  }

  static async getMedications(userId: string): Promise<WithId<Medication>[]> {
    validateGetMedications({ userId });

    const medications = await MedicationDAO.getMedicationsByUserId(userId);

    return medications.map((medication) => ({
      ...medication.toObject(),
      _id: medication._id.toString(),
    }));
  }
}

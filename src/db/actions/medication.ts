import { HydratedDocument, Types } from "mongoose";
import MedicationModel, {
  Medication,
  MedicationDocument,
} from "../models/medication";
import dbConnect from "../dbConnect";

export default class MedicationDAO {
  static async createNewMedication(
    newMedication: Medication,
  ): Promise<HydratedDocument<MedicationDocument>> {
    try {
      await dbConnect();
      return await MedicationModel.insertOne(newMedication);
    } catch (error) {
      throw new Error(
        "Failed to create medication: " + (error as Error).message,
      );
    }
  }

  static async getMedicationById(
    _id: Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument> | null> {
    await dbConnect();
    return await MedicationModel.findById(_id);
  }

  static async getUserMedicationByMedicationId(
    medicationId: string,
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument> | null> {
    await dbConnect();
    return await MedicationModel.findOne({ medicationId, userId });
  }

  static async updateMedicationById(
    _id: Types.ObjectId,
    updateObj: Medication,
  ): Promise<void> {
    await dbConnect();
    const result = await MedicationModel.updateOne({ _id }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error("Failed to update medication.");
    }
  }

  static async deleteMedicationById(_id: Types.ObjectId): Promise<void> {
    await dbConnect();
    const result = await MedicationModel.deleteOne({ _id });
    if (result.deletedCount == 0) {
      throw new Error("Failed to delete medication.");
    }
  }

  static async getMedicationsByUserId(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument>[]> {
    return await MedicationModel.find({ userId });
  }
}

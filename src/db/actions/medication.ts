import { HydratedDocument, Types } from "mongoose";
import MedicationModel, {
  Medication,
  MedicationDocument,
} from "../models/medication";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

export default class MedicationDAO {
  static async createNewMedication(
    newMedication: Medication,
  ): Promise<HydratedDocument<MedicationDocument>> {
    await dbConnect();
    return await MedicationModel.insertOne(newMedication);
  }

  static async getMedicationById(
    id: string | Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument> | null> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    return await MedicationModel.findById(_id);
  }

  static async getUserMedicationByMedicationId(
    medicationId: string,
    _userId: string | Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument> | null> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    return await MedicationModel.findOne({ medicationId, userId });
  }

  static async updateMedicationById(
    id: string | Types.ObjectId,
    updateObj: Medication,
  ): Promise<void> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const result = await MedicationModel.updateOne({ _id }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.MEDICATION.FAILURE.UPDATE);
    }
  }

  static async deleteMedicationById(
    id: string | Types.ObjectId,
  ): Promise<void> {
    const _id = id instanceof Types.ObjectId ? id : new Types.ObjectId(id);
    await dbConnect();
    const result = await MedicationModel.deleteOne({ _id });
    if (result.deletedCount == 0) {
      throw new Error(ERRORS.MEDICATION.FAILURE.DELETE);
    }
  }

  static async getMedicationsByUserId(
    _userId: string | Types.ObjectId,
  ): Promise<HydratedDocument<MedicationDocument>[]> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    return await MedicationModel.find({ userId });
  }
}

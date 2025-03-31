import { HydratedDocument, Types } from "mongoose";
import {
  MedicationModel,
  Medication,
  MedicationDocument,
} from "../models/medication";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";
import {
  MedicationCheckIn,
  MedicationCheckInDocument,
  MedicationCheckInModel,
} from "../models/medicationCheckIn";
import {
  MedicationLog,
  MedicationLogDocument,
  MedicationLogModel,
} from "../models/medicationLog";

export default class MedicationDAO {
  static async createNewMedication(
    newMedication: Medication,
  ): Promise<HydratedDocument<MedicationDocument>> {
    await dbConnect();
    return await MedicationModel.insertOne(newMedication);
  }

  static async getMedicationById(
    id: string,
  ): Promise<HydratedDocument<MedicationDocument> | null> {
    const _id = new Types.ObjectId(id);
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
    id: string,
    updateObj: Medication,
  ): Promise<void> {
    const _id = new Types.ObjectId(id);
    await dbConnect();
    await MedicationModel.replaceOne({ _id }, updateObj);
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
    _userId: string,
  ): Promise<HydratedDocument<MedicationDocument>[]> {
    const userId = new Types.ObjectId(_userId);
    return await MedicationModel.find({ userId });
  }

  static async createMedicationLog(
    medicationId: string,
    dateTaken: Date,
  ): Promise<HydratedDocument<MedicationLogDocument> | null> {
    await dbConnect();

    const medicationCheckIn: MedicationLog = {
      medicationId: new Types.ObjectId(medicationId),
      dateTaken: dateTaken,
    };

    return await MedicationLogModel.insertOne(medicationCheckIn);
  }

  static async getMedicationLogs(
    medicationId: string,
  ): Promise<HydratedDocument<MedicationLogDocument>[]> {
    const medicationIdObj = new Types.ObjectId(medicationId);
    await dbConnect();
    return await MedicationLogModel.find({
      medicationId: medicationIdObj,
    }).sort({ dateTaken: -1 });
  }

  static async createMedicationCheckIn(
    medicationId: string,
    expiration: Date,
  ): Promise<HydratedDocument<MedicationCheckInDocument> | null> {
    await dbConnect();

    const medicationCheckIn: MedicationCheckIn = {
      medicationId: new Types.ObjectId(medicationId),
      expiration,
    };

    return await MedicationCheckInModel.insertOne(medicationCheckIn);
  }

  static async getMedicationCheckIn(
    medicationId: string,
  ): Promise<HydratedDocument<MedicationCheckInDocument> | null> {
    const medicationIdObj = new Types.ObjectId(medicationId);
    await dbConnect();
    return await MedicationCheckInModel.findOne({
      medicationId: medicationIdObj,
    });
  }

  static async deleteMedicationCheckIn(medicationId: string) {
    const medicationIdObj = new Types.ObjectId(medicationId);
    await dbConnect();
    const result = await MedicationCheckInModel.deleteOne({
      medicationId: medicationIdObj,
    });

    if (result.deletedCount == 0) {
      throw new Error("Failed to delete medication.");
    }
  }
}

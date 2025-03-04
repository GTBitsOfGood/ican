import client from "../dbClient";
import { Medication, MedicationCheckIn, MedicationLog } from "../models";
import { ObjectId } from "mongodb";

export default class MedicationDAO {
  static async createNewMedication(newMedication: Medication) {
    const db = client.db();
    try {
      const result = await db.collection("medication").insertOne(newMedication);

      return result;
    } catch (error) {
      throw new Error(
        "Failed to create medication: " + (error as Error).message,
      );
    }
  }

  static async getMedicationById(id: ObjectId) {
    const db = client.db();

    const medication = await db.collection("medication").findOne({ _id: id });

    return medication;
  }

  static async getUserMedicationByMedicationId(
    medicationId: string,
    userId: ObjectId,
  ) {
    const db = client.db();

    const medication = await db
      .collection("medication")
      .findOne({ medicationId, userId });

    return medication;
  }

  static async updateMedicationById(id: ObjectId, updateObj: Medication) {
    const db = client.db();
    const result = await db
      .collection("medication")
      .updateOne({ _id: id }, { $set: updateObj });

    if (result.modifiedCount == 0) {
      throw new Error("Failed to update medication.");
    }
  }

  static async deleteMedicationById(id: ObjectId) {
    const db = client.db();
    const result = await db.collection("medication").deleteOne({ _id: id });

    if (result.deletedCount == 0) {
      throw new Error("Failed to delete medication.");
    }
  }

  // this function retrieves list of medications
  static async getMedicationsByUserId(userId: ObjectId) {
    const db = client.db();

    const medication = db.collection("medication").find({ userId });

    return medication;
  }

  static async createMedicationCheckIn(
    newMedicationCheckIn: MedicationCheckIn,
  ) {
    const db = client.db();
    try {
      const result = await db
        .collection("MedicationCheckIn")
        .insertOne(newMedicationCheckIn);

      return result;
    } catch (error) {
      throw new Error(
        "Failed to create medication check in: " + (error as Error).message,
      );
    }
  }

  static async createMedicationLog(newMedicationLog: MedicationLog) {
    const db = client.db();
    try {
      const result = await db
        .collection("MedicationLog")
        .insertOne(newMedicationLog);

      return result;
    } catch (error) {
      throw new Error(
        "Failed to create medication log: " + (error as Error).message,
      );
    }
  }

  static async getMedicationCheckInAction(medicationId: ObjectId) {
    const db = client.db();
    try {
      const result = await db
        .collection("MedicationCheckIn")
        .findOne({ medicationId });

      return result;
    } catch (error) {
      throw new Error(
        "Failed to get medication check in: " + (error as Error).message,
      );
    }
  }

  static async deleteMedicationCheckInAction(medicationId: ObjectId) {
    const db = client.db();
    const result = await db
      .collection("MedicationCheckIn")
      .deleteOne({ medicationId });

    if (result.deletedCount == 0) {
      throw new Error("Failed to delete medication.");
    }
  }
}

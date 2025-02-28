import client from "../dbClient";
import { Medication } from "../models";
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
}

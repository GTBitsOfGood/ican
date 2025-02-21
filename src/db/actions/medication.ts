import client from "../dbClient";
import { Medication } from "../models";
import { ObjectId } from "mongodb";

export async function createNewMedication(newMedication: Medication) {
  const db = client.db();
  try {
    const result = await db.collection("medication").insertOne(newMedication);

    return result;
  } catch (error) {
    throw new Error("Failed to create medication: " + (error as Error).message);
  }
}

export async function getMedicationById(id: ObjectId) {
  const db = client.db();

  const medication = await db.collection("medication").findOne({ _id: id });

  return medication;
}

export async function getUserMedicationByMedicationId(
  medicationId: string,
  userId: ObjectId,
) {
  const db = client.db();

  const medication = await db
    .collection("medication")
    .findOne({ medicationId, userId });

  return medication;
}

export async function updateMedicationById(
  id: ObjectId,
  updateObj: Medication,
) {
  const db = client.db();
  const result = await db
    .collection("medication")
    .updateOne({ _id: id }, { $set: updateObj });

  if (result.modifiedCount == 0) {
    throw new Error("Failed to update medication.");
  }
}

export async function deleteMedicationById(id: ObjectId) {
  const db = client.db();
  const result = await db.collection("medication").deleteOne({ _id: id });

  if (result.deletedCount == 0) {
    throw new Error("Failed to delete medication.");
  }
}

// this function retrieves list of medications
export async function getMedicationsByUserId(userId: ObjectId) {
  const db = client.db();

  const medication = db.collection("medication").find({ userId });

  return medication;
}

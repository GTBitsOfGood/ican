import { InternalServerError } from "@/types/exceptions";
import client from "../dbClient";
import { Medication, MedicationCheckIn } from "../models";
import { ObjectId } from "mongodb";

export async function createNewMedication(newMedication: Medication) {
  const db = client.db();
  try {
    const result = await db.collection("medication").insertOne(newMedication);

    return result;
  } catch (error) {
    throw new InternalServerError(
      "Failed to create medication: " + (error as Error).message,
    );
  }
}

export async function getMedicationById(id: ObjectId) {
  const db = client.db();

  const medication = await db.collection("medication").findOne({ _id: id });

  return medication;
}

export async function getMedicationByMedicationId(medicationId: string) {
  const db = client.db();

  const medication = await db
    .collection("medication")
    .findOne({ medicationId });

  return medication;
}

export async function updateMedicationById(
  id: ObjectId,
  updateObj: {
    formOfMedication?: string;
    medicationId?: string | string[] | undefined;
    repeatInterval?: number;
    repeatUnit?: string;
    repeatOn?: string[];
    repeatMonthlyOnDay?: number;
    notificationFrequency?: string;
    dosesPerDay?: number;
    doseIntervalInHours?: number;
    // string of times
    doseTimes?: string[];
  },
) {
  const db = client.db();
  const result = await db
    .collection("medication")
    .updateOne({ _id: id }, { $set: { ...updateObj } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update medication.");
  }
}

export async function deleteMedicationById(id: ObjectId) {
  const db = client.db();
  const result = await db.collection("medication").deleteOne({ _id: id });

  if (result.deletedCount == 0) {
    throw new InternalServerError("Failed to delete medication.");
  }
}

// this function retrieves list of medications
export async function getMedicationsByUserId(userId: ObjectId) {
  const db = client.db();

  const medication = db.collection("medication").find({ userId });

  return medication;
}

export async function createMedicationCheckInAction(
  newMedicationCheckIn: MedicationCheckIn,
) {
  const db = client.db();
  try {
    const result = await db
      .collection("MedicationCheckIn")
      .insertOne(newMedicationCheckIn);

    return result;
  } catch (error) {
    throw new InternalServerError(
      "Failed to create medication check in: " + (error as Error).message,
    );
  }
}

export async function getMedicationCheckInAction(medicationId: ObjectId) {
  const db = client.db();
  try {
    const result = await db
      .collection("MedicationCheckIn")
      .findOne({ medicationId });

    return result;
  } catch (error) {
    throw new InternalServerError(
      "Failed to get medication check in: " + (error as Error).message,
    );
  }
}

export async function deleteMedicationCheckInAction(medicationId: ObjectId) {
  const db = client.db();
  const result = await db
    .collection("MedicationCheckIn")
    .deleteOne({ medicationId });

  if (result.deletedCount == 0) {
    throw new InternalServerError("Failed to delete medication.");
  }
}

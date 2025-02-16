import { InternalServerError } from "@/types/exceptions";
import client from "../dbClient";
import { Medication } from "../models";
import { UpdateMedicationRequestBody } from "@/types/medication";

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

export async function getMedicationById(medicationId: string) {
  const db = client.db();

  const medication = await db
    .collection("medication")
    .findOne({ medicationId });

  return medication;
}

export async function updateMedicationById(
  medicationId: string,
  updateObj: UpdateMedicationRequestBody,
) {
  const db = client.db();
  const result = await db
    .collection("medication")
    .updateOne({ medicationId: medicationId }, { $set: { ...updateObj } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update medication.");
  }
}

export async function deleteMedicationById(medicationId: string) {
  const db = client.db();
  const result = await db.collection("medication").deleteOne({ medicationId });

  if (result.deletedCount == 0) {
    throw new InternalServerError("Failed to delete medication.");
  }
}

// this function retrieves list of medications
export async function getMedicationsByUserId(userId: string) {
  const db = client.db();

  const medication = db.collection("medication").find({ userId });

  return medication;
}

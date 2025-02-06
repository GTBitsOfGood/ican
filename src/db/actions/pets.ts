import { InternalError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import client from "../dbClient";
import { Pet } from "../models";

export async function createNewPet(newPet: Pet) {
  const db = client.db();

  try {
    await db.collection("pets").insertOne(newPet);
  } catch (error) {
    throw new InternalError(
      "Failed to create pet: " + (error as Error).message,
    );
  }
}

export async function getPetByUserId(userId: ObjectId) {
  const db = client.db();
  return await db.collection("pets").findOne({ userId: userId });
}

export async function updatePetByUserId(userId: ObjectId, name: string) {
  const db = client.db();
  const result = await db
    .collection("pets")
    .updateOne({ userId: userId }, { $set: { name: name } });

  if (result.modifiedCount == 0) {
    throw new InternalError("Failed to update pet.");
  }
}

export async function deletePetByUserId(userId: ObjectId) {
  const db = client.db();
  const result = await db.collection("pets").deleteOne({ userId: userId });

  if (result.deletedCount == 0) {
    throw new InternalError("Failed to delete pet.");
  }
}

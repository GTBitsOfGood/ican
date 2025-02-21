import { InternalServerError } from "@/types/exceptions";
import { ObjectId } from "mongodb";
import client from "../dbClient";
import { Pet } from "../models";

export async function createNewPet(newPet: Pet) {
  const db = client.db();

  try {
    await db.collection("pets").insertOne(newPet);
  } catch (error) {
    throw new InternalServerError(
      "Failed to create pet: " + (error as Error).message,
    );
  }
}

export async function getPetByUserId(userId: ObjectId) {
  const db = client.db();
  const pet = await db.collection("pets").findOne({ userId: userId });

  return pet;
}

export async function getPetByPetId(petId: ObjectId) {
  const db = client.db();
  const pet = await db.collection("pets").findOne({ _id: petId });

  return pet;
}

export async function updatePetNameByUserId(userId: ObjectId, name: string) {
  const db = client.db();
  const result = await db
    .collection("pets")
    .updateOne({ userId: userId }, { $set: { name: name } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update pet.");
  }
}

export async function updatePetCoinsByPetId(
  petId: ObjectId,
  newBalance: number,
) {
  const db = client.db();
  const result = await db
    .collection("pets")
    .updateOne({ _id: petId }, { $set: { coins: newBalance } });

  if (result.modifiedCount == 0) {
    throw new InternalServerError("Failed to update pet.");
  }
}

export async function deletePetByUserId(userId: ObjectId) {
  const db = client.db();
  const result = await db.collection("pets").deleteOne({ userId: userId });

  if (result.deletedCount == 0) {
    throw new InternalServerError("Failed to delete pet.");
  }
}

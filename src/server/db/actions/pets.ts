import { ObjectId } from "mongodb";
import client from "../dbClient";
import { Pet } from "../models";
import { CustomError } from "@/utils/types/exceptions";

export async function createPet(newPet: Pet) {
  const db = client.db();

  try {
    await db.collection("pets").insertOne(newPet);
  } catch (error) {
    throw new CustomError(
      500,
      "Failed to create pet: " + (error as Error).message,
    );
  }
}

export async function getPetByUserId(id: ObjectId) {
  const db = client.db();
  const pet = await db.collection("pets").findOne({ userId: id });

  return pet;
}

export async function updatePetByUserId(id: ObjectId, name: string) {
  const db = client.db();
  try {
    const updatedPet = await db
      .collection("pets")
      .findOneAndUpdate(
        { userId: id },
        { $set: { name: name } },
        { returnDocument: "after" },
      );

    return updatedPet;
  } catch (error) {
    throw new CustomError(
      500,
      "Failed to update pet: " + (error as Error).message,
    );
  }
}

export async function deletePetByUserId(id: ObjectId) {
  const db = client.db();
  try {
    const pet = await db.collection("pets").findOneAndDelete({ userId: id });

    return pet;
  } catch (error) {
    throw new CustomError(
      500,
      "Failed to delete pet: " + (error as Error).message,
    );
  }
}

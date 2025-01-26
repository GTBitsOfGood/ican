import client from "../dbClient";
import { Pet } from "../models";

export async function createPet(newPet: Pet) {
  const db = client.db();
  db.collection("pets").insertOne(newPet);
}

export async function getPetByUserId(id: number) {
  const db = client.db();
  const pet = await db.collection("pets").findOne({ userId: id });

  return pet;
}

export async function updatePetByUserId(id: number, name: string) {
  const db = client.db();
  const updatedPet = await db
    .collection("pets")
    .findOneAndUpdate(
      { userId: id },
      { $set: { name: name } },
      { returnDocument: "after" },
    );

  return updatedPet;
}

export async function deletePetByUserId(id: number) {
  const db = client.db();
  const pet = await db.collection("pets").findOneAndDelete({ userId: id });

  return pet;
}

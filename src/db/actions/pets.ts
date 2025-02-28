import { ObjectId } from "mongodb";
import client from "../dbClient";
import { Pet } from "../models";

export default class PetDAO {
  static async createNewPet(newPet: Pet) {
    const db = client.db();
    try {
      await db.collection("pets").insertOne(newPet);
    } catch (error) {
      throw new Error("Failed to create pet: " + (error as Error).message);
    }
  }

  static async getPetByUserId(userId: ObjectId) {
    const db = client.db();
    const pet = await db.collection("pets").findOne({ userId: userId });

    return pet;
  }

  static async updatePetByUserId(userId: ObjectId, name: string) {
    const db = client.db();
    const result = await db
      .collection("pets")
      .updateOne({ userId: userId }, { $set: { name: name } });

    if (result.modifiedCount == 0) {
      throw new Error("Failed to update pet.");
    }
  }

  static async deletePetByUserId(userId: ObjectId) {
    const db = client.db();
    const result = await db.collection("pets").deleteOne({ userId: userId });

    if (result.deletedCount == 0) {
      throw new Error("Failed to delete pet.");
    }
  }
}

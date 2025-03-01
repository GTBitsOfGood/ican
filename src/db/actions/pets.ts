import { HydratedDocument, Types } from "mongoose";
import PetModel, { Pet, PetDocument } from "../models/pet";
import dbConnect from "../dbConnect";

export default class PetDAO {
  static async createNewPet(
    newPet: Pet,
  ): Promise<HydratedDocument<PetDocument>> {
    await dbConnect();
    try {
      return await PetModel.insertOne(newPet);
    } catch (error) {
      throw new Error("Failed to create pet: " + (error as Error).message);
    }
  }

  static async getPetByUserId(
    userId: Types.ObjectId,
  ): Promise<HydratedDocument<PetDocument> | null> {
    await dbConnect();
    return await PetModel.findOne({ userId });
  }

  static async updatePetByUserId(
    userId: Types.ObjectId,
    name: string,
  ): Promise<void> {
    await dbConnect();
    const result = await PetModel.updateOne({ userId }, { name });
    if (result.modifiedCount == 0) {
      throw new Error("Failed to update pet.");
    }
  }

  static async deletePetByUserId(userId: Types.ObjectId): Promise<void> {
    await dbConnect();
    const result = await PetModel.deleteOne({ userId });
    if (result.deletedCount == 0) {
      throw new Error("Failed to delete pet.");
    }
  }
}

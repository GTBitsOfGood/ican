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
    _userId: string | Types.ObjectId,
  ): Promise<HydratedDocument<PetDocument> | null> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    return await PetModel.findOne({ userId });
  }

  static async updatePetByUserId(
    _userId: string | Types.ObjectId,
    name: string,
  ): Promise<void> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    const result = await PetModel.updateOne({ userId }, { name });
    if (result.modifiedCount == 0) {
      throw new Error("Failed to update pet.");
    }
  }

  static async deletePetByUserId(
    _userId: string | Types.ObjectId,
  ): Promise<void> {
    const userId =
      _userId instanceof Types.ObjectId ? _userId : new Types.ObjectId(_userId);
    await dbConnect();
    const result = await PetModel.deleteOne({ userId });
    if (result.deletedCount == 0) {
      throw new Error("Failed to delete pet.");
    }
  }
}

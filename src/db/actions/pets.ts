import { HydratedDocument, Types } from "mongoose";
import PetModel, { Pet, PetDocument } from "../models/pet";
import dbConnect from "../dbConnect";
import ERRORS from "@/utils/errorMessages";

export default class PetDAO {
  static async createNewPet(
    newPet: Pet,
  ): Promise<HydratedDocument<PetDocument>> {
    await dbConnect();
    return await PetModel.insertOne(newPet);
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
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
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
      throw new Error(ERRORS.PET.FAILURE.DELETE);
    }
  }
}

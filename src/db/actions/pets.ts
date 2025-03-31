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
    _userId: string,
  ): Promise<HydratedDocument<PetDocument> | null> {
    const userId = new Types.ObjectId(_userId);
    await dbConnect();
    return await PetModel.findOne({ userId });
  }

  static async updatePetByUserId(
    _userId: string,
    updateObj: {
      name?: string;
      xpGained?: number;
      xpLevel?: number;
      coins?: number;
      food?: number;
    },
  ): Promise<void> {
    const userId = new Types.ObjectId(_userId);
    await dbConnect();
    const result = await PetModel.updateOne({ userId }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }

  static async deletePetByUserId(_userId: string): Promise<void> {
    const userId = new Types.ObjectId(_userId);
    await dbConnect();
    const result = await PetModel.deleteOne({ userId });
    if (result.deletedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.DELETE);
    }
  }

  static async getPetByPetId(_petId: string): Promise<Pet | null> {
    const petId = new Types.ObjectId(_petId);

    await dbConnect();

    return await PetModel.findOne({ _id: petId });
  }

  static async updatePetNameByUserId(
    _userId: string,
    name: string,
  ): Promise<void> {
    const userId = new Types.ObjectId(_userId);

    await dbConnect();

    const result = await PetModel.updateOne({ userId }, { name });
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }
  static async updatePetCoinsByPetId(
    _petId: string,
    newBalance: number,
  ): Promise<void> {
    const petId = new Types.ObjectId(_petId);
    await dbConnect();

    const result = await PetModel.updateOne(
      { _id: petId },
      { coins: newBalance },
    );
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }

  static async updatePetAppearanceByPetId(
    _petId: string,
    newAppearance: Pet["appearance"],
  ): Promise<void> {
    const petId = new Types.ObjectId(_petId);
    await dbConnect();

    const result = await PetModel.updateOne(
      { _id: petId },
      { appearance: newAppearance },
    );
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }

  static async updatePetByPetId(
    _petId: string,
    updateObj: {
      name?: string;
      xpGained?: number;
      xpLevel?: number;
      coins?: number;
      food?: number;
    },
  ): Promise<void> {
    const petId = new Types.ObjectId(_petId);
    await dbConnect();
    const result = await PetModel.updateOne({ _id: petId }, updateObj);
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }
}

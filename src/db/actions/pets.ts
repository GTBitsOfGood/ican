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

  static async getPetByPetId(
    _petId: string | Types.ObjectId,
  ): Promise<Pet | null> {
    const petId =
      _petId instanceof Types.ObjectId ? _petId : new Types.ObjectId(_petId);

    await dbConnect();

    return await PetModel.findOne({ _id: petId });
  }

  static async updatePetNameByUserId(
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
  static async updatePetCoinsByPetId(
    _petId: string | Types.ObjectId,
    newBalance: number,
  ): Promise<void> {
    const petId =
      _petId instanceof Types.ObjectId ? _petId : new Types.ObjectId(_petId);
    await dbConnect();

    const result = await PetModel.updateOne({ petId }, { coins: newBalance });
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }

  static async updatePetAppearanceByPetId(
    _petId: string | Types.ObjectId,
    newAppearance: Pet["appearance"],
  ): Promise<void> {
    const petId =
      _petId instanceof Types.ObjectId ? _petId : new Types.ObjectId(_petId);
    await dbConnect();

    const result = await PetModel.updateOne(
      { petId },
      { appearance: newAppearance },
    );
    if (result.modifiedCount == 0) {
      throw new Error(ERRORS.PET.FAILURE.UPDATE);
    }
  }
}

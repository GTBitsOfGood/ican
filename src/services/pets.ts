import { ConflictError, NotFoundError } from "@/types/exceptions";
import { validateParams } from "@/utils/pets";
import PetDAO from "@/db/actions/pets";
import { HydratedDocument, Types } from "mongoose";
import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";

export default class PetService {
  static async createPet(
    userId: string,
    name: string,
    petType: string,
  ): Promise<HydratedDocument<Pet>> {
    await validateParams(userId, name, petType);

    const existingPet = await PetDAO.getPetByUserId(new Types.ObjectId(userId));
    if (existingPet) {
      throw new ConflictError("This user already has a pet");
    }

    const newPet = {
      name,
      petType,
      xpGained: 0,
      xpLevel: 0,
      coins: 0,
      userId: new Types.ObjectId(userId),
    };

    return await PetDAO.createNewPet(newPet);
  }

  static async getPet(userId: string): Promise<WithId<Pet> | null> {
    await validateParams(userId);
    const existingPet = await PetDAO.getPetByUserId(new Types.ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    return existingPet.toObject();
  }

  static async updatePet(userId: string, name: string): Promise<void> {
    await validateParams(userId, name);
    const existingPet = await PetDAO.getPetByUserId(new Types.ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.updatePetByUserId(new Types.ObjectId(userId), name);
  }

  static async deletePet(userId: string): Promise<void> {
    await validateParams(userId);
    const existingPet = await PetDAO.getPetByUserId(new Types.ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.deletePetByUserId(new Types.ObjectId(userId));
  }
}

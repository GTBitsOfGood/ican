import { ConflictError, NotFoundError } from "@/types/exceptions";
import {
  validateCreatePet,
  validateDeletePet,
  validateGetPet,
  validateUpdatePet,
} from "@/utils/serviceUtils/petsUtil";
import PetDAO from "@/db/actions/pets";
import { Types } from "mongoose";
import { Pet } from "@/db/models/pet";
import ERRORS from "@/utils/errorMessages";
import { WithId } from "@/types/models";

export default class PetService {
  static async createPet(
    userId: string,
    name: string,
    petType: string,
  ): Promise<WithId<Pet>> {
    await validateCreatePet({ userId, name, petType });

    const existingPet = await PetDAO.getPetByUserId(userId);
    if (existingPet) {
      throw new ConflictError(ERRORS.PET.CONFLICT);
    }

    const newPet = {
      name,
      petType,
      xpGained: 0,
      xpLevel: 0,
      coins: 0,
      userId: new Types.ObjectId(userId),
    };

    const insertedPet = await PetDAO.createNewPet(newPet);
    return { ...insertedPet.toObject(), _id: insertedPet._id.toString() };
  }

  static async getPet(userId: string): Promise<WithId<Pet> | null> {
    await validateGetPet({ userId });
    const existingPet = await PetDAO.getPetByUserId(userId);
    if (!existingPet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }
    return { ...existingPet.toObject(), _id: existingPet._id.toString() };
  }

  static async updatePet(userId: string, name: string): Promise<void> {
    await validateUpdatePet({ userId, name });
    const existingPet = await PetDAO.getPetByUserId(userId);

    if (!existingPet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }
    await PetDAO.updatePetByUserId(userId, name);
  }

  static async deletePet(userId: string): Promise<void> {
    await validateDeletePet({ userId });
    const existingPet = await PetDAO.getPetByUserId(userId);

    if (!existingPet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }
    await PetDAO.deletePetByUserId(userId);
  }
}

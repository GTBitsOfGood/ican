import { ConflictError, NotFoundError } from "@/types/exceptions";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import PetDAO from "@/db/actions/pets";
import {
  validateCreatePet,
  validateDeletePet,
  validateGetPet,
  validateUpdatePet,
} from "@/utils/serviceUtils/petsUtil";

export default class PetService {
  static async createPet(
    userId: string,
    name: string,
    petType: string,
  ): Promise<Pet> {
    await validateCreatePet({ userId, name, petType });

    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (existingPet) {
      throw new ConflictError("This user already has a pet");
    }

    const newPet = {
      name,
      petType,
      xpGained: 0,
      xpLevel: 0,
      coins: 0,
      userId: new ObjectId(userId),
    };

    await PetDAO.createNewPet(newPet);
    return newPet;
  }

  static async getPet(userId: string): Promise<Pet | null> {
    await validateGetPet({ userId });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    return existingPet as Pet;
  }

  static async updatePet(userId: string, name: string) {
    await validateUpdatePet({ userId, name });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.updatePetByUserId(new ObjectId(userId), name);
  }

  static async deletePet(userId: string) {
    await validateDeletePet({ userId });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.deletePetByUserId(new ObjectId(userId));
  }
}

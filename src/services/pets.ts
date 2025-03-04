import { ConflictError, NotFoundError } from "@/types/exceptions";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import { validateParams } from "@/utils/pets";
import PetDAO from "@/db/actions/pets";
import { LEVEL_THRESHOLD, XP_GAIN } from "@/utils/constants";

export default class PetService {
  static async createPet(
    userId: string,
    name: string,
    petType: string,
  ): Promise<Pet> {
    await validateParams({ userId, name, petType });

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
      food: 0,
      userId: new ObjectId(userId),
    };

    await PetDAO.createNewPet(newPet);
    return newPet;
  }

  static async getPet(userId: string): Promise<Pet | null> {
    await validateParams({ userId });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    return existingPet as Pet;
  }

  static async updatePet(userId: string, name: string) {
    await validateParams({ userId, name });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.updatePetByUserId(new ObjectId(userId), name);
  }

  static async deletePet(userId: string) {
    await validateParams({ userId });
    const existingPet = await PetDAO.getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await PetDAO.deletePetByUserId(new ObjectId(userId));
  }

  static async feedPet(petId: string) {
    await validateParams({ petId });

    const existingPet = (await PetDAO.getPetByPetId(
      new ObjectId(petId),
    )) as Pet;
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }

    const updatedPet: Pet = existingPet;
    if (updatedPet.xpGained >= LEVEL_THRESHOLD - XP_GAIN) {
      updatedPet.xpLevel += 1;
      updatedPet.xpGained = (XP_GAIN + updatedPet.xpGained) % LEVEL_THRESHOLD;
    } else {
      updatedPet.xpGained += XP_GAIN;
    }

    await PetDAO.updatePetByPetId(new ObjectId(petId), {
      xpGained: updatedPet.xpGained,
      xpLevel: updatedPet.xpLevel,
    });
  }
}

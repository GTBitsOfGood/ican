import { ConflictError, NotFoundError } from "@/types/exceptions";
import {
  createNewPet,
  deletePetByUserId,
  getPetByUserId,
  updatePetByUserId,
} from "../db/actions/pets";
import { Pet } from "../db/models";
import { ObjectId } from "mongodb";
import { validateParams } from "@/utils/pets";

export const petService = {
  async createPet(userId: string, name: string, petType: string): Promise<Pet> {
    await validateParams(userId, name, petType);

    const existingPet = await getPetByUserId(new ObjectId(userId));
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

    await createNewPet(newPet);
    return newPet;
  },

  async getPet(userId: string): Promise<Pet | null> {
    await validateParams(userId);
    const existingPet = await getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    return existingPet as Pet;
  },

  async updatePet(userId: string, name: string) {
    await validateParams(userId, name);
    const existingPet = await getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await updatePetByUserId(new ObjectId(userId), name);
  },

  async deletePet(userId: string) {
    await validateParams(userId);
    const existingPet = await getPetByUserId(new ObjectId(userId));
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }
    await deletePetByUserId(new ObjectId(userId));
  },
};

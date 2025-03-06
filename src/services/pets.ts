import { ConflictError, NotFoundError } from "@/types/exceptions";
import {
  validateItemAttribute,
  validateItemName,
  validatePetId,
} from "@/utils/store";
import { getBagItemByPetIdAndName } from "@/db/actions/bag";
import { AccessoryType, storeItems } from "@/types/store";
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
import { ObjectId } from "mongodb";

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
      appearance: {},
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

export async function validateEquipItem(petId: string, itemName: string) {
  validatePetId(petId);
  validateItemName(itemName);

  const pet = (await PetDAO.getPetByPetId(petId)) as Pet;
  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const item = storeItems.find((item) => item.itemName === itemName);
  if (!item) {
    throw new NotFoundError("This item does not exist.");
  }

  const dbItem = await getBagItemByPetIdAndName(new ObjectId(petId), itemName);
  if (!dbItem) {
    throw new NotFoundError("This pet does not own this item.");
  }

  if (
    Object.values(pet.appearance).includes(item.itemName) ||
    (pet.appearance.accessories &&
      Object.values(pet.appearance.accessories).includes(item.itemName))
  ) {
    throw new ConflictError("This item is already equipped.");
  }

  const prevAppearance = pet.appearance;
  let newAppearance = {};

  if (Object.values(AccessoryType).includes(item.type as AccessoryType)) {
    newAppearance = {
      ...prevAppearance,
      accessories: {
        ...prevAppearance.accessories,
        [item.type]: itemName,
      },
    };
  } else {
    newAppearance = {
      ...prevAppearance,
      [item.type]: itemName,
    };
  }

  await PetDAO.updatePetAppearanceByPetId(petId, newAppearance);
}

export async function validateUnequip(petId: string, attribute: string) {
  validatePetId(petId);
  validateItemAttribute(attribute);

  const pet = (await PetDAO.getPetByPetId(petId)) as Pet;
  if (!pet) {
    throw new NotFoundError("This pet does not exist.");
  }

  const prevAppearance = pet.appearance;
  let newAppearance = {};

  if (Object.values(AccessoryType).includes(attribute as AccessoryType)) {
    newAppearance = {
      ...prevAppearance,
      accessories: {
        ...prevAppearance.accessories,
        [attribute]: null,
      },
    };
  } else {
    newAppearance = {
      ...prevAppearance,
      [attribute]: null,
    };
  }

  await PetDAO.updatePetAppearanceByPetId(petId, newAppearance);
}

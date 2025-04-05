import {
  ConflictError,
  InvalidArgumentsError,
  NotFoundError,
} from "@/types/exceptions";
import {
  validateAppearance,
  validateItemAttribute,
  validateItemName,
  validatePetId,
} from "@/utils/store";
import BagDAO from "@/db/actions/bag";
import storeItems from "@/lib/storeItems";
import {
  validateCreatePet,
  validateDeletePet,
  validateFeedPet,
  validateGetPet,
  validateUpdatePet,
} from "@/utils/serviceUtils/petsUtil";
import PetDAO from "@/db/actions/pets";
import { LEVEL_THRESHOLD, XP_GAIN } from "@/utils/constants";
import { Types } from "mongoose";
import { Appearance, Pet } from "@/db/models/pet";
import ERRORS from "@/utils/errorMessages";
import { WithId } from "@/types/models";
import { ItemType } from "@/types/inventory";
import { nameIsValid } from "@/utils/validation";

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
      food: 0,
      userId: new Types.ObjectId(userId),
      appearance: {},
      outfits: [],
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

    await PetDAO.updatePetByUserId(userId, { name });
  }

  static async deletePet(userId: string): Promise<void> {
    await validateDeletePet({ userId });
    const existingPet = await PetDAO.getPetByUserId(userId);

    if (!existingPet) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }
    await PetDAO.deletePetByUserId(userId);
  }

  static async feedPet(petId: string) {
    await validateFeedPet({ petId });

    const existingPet: Pet | null = await PetDAO.getPetByPetId(petId);
    if (!existingPet) {
      throw new NotFoundError("This pet does not exist");
    }

    if (existingPet.food <= 0) {
      throw new InvalidArgumentsError("This pet does not have enough food.");
    }

    const updatedPet: Pet = existingPet;
    if (updatedPet.xpGained >= LEVEL_THRESHOLD - XP_GAIN) {
      updatedPet.xpLevel += 1;
      updatedPet.xpGained = (XP_GAIN + updatedPet.xpGained) % LEVEL_THRESHOLD;
    } else {
      updatedPet.xpGained += XP_GAIN;
    }

    await PetDAO.updatePetByPetId(petId, {
      xpGained: updatedPet.xpGained,
      xpLevel: updatedPet.xpLevel,
      food: --updatedPet.food,
    });
  }

  static async validateEquipItem(petId: string, name: string, type: string) {
    validatePetId(petId);
    validateItemName(name);
    validateItemAttribute(type);

    const pet = (await PetDAO.getPetByPetId(petId))?.toObject();
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    const item = storeItems?.[type]?.[name] || storeItems.accessory?.[name];
    if (!item) {
      throw new NotFoundError("This item does not exist.");
    }

    const dbItem = await BagDAO.getBagItemByPetIdAndName(petId, name);
    if (!dbItem) {
      throw new NotFoundError("This pet does not own this item.");
    }

    if (Object.values(pet.appearance || {}).includes(name)) {
      throw new ConflictError("This item is already equipped.");
    }

    const newAppearance = pet.appearance || {};
    newAppearance[item.type as Exclude<ItemType, ItemType.FOOD>] = name;
    await PetDAO.updatePetAppearanceByPetId(petId, newAppearance);
  }

  static async validateUnequip(petId: string, attribute: string) {
    validatePetId(petId);
    validateItemAttribute(attribute);

    const pet = (await PetDAO.getPetByPetId(petId))?.toObject();
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    const newAppearance = pet.appearance;
    newAppearance[attribute as Exclude<ItemType, ItemType.FOOD>] = undefined;
    await PetDAO.updatePetAppearanceByPetId(petId, newAppearance);
  }

  static async validateEquipOutfit(petId: string, appearance: Appearance) {
    validatePetId(petId);
    validateAppearance(appearance);

    const pet = (await PetDAO.getPetByPetId(petId))?.toObject();
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    await PetDAO.updatePetAppearanceByPetId(petId, appearance);
  }

  static async saveOutfit(petId: string, name: string, appearance: Appearance) {
    validatePetId(petId);
    validateAppearance(appearance);
    nameIsValid(name);

    const pet = (await PetDAO.getPetByPetId(petId))?.toObject();
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    if (pet.outfits.map((i) => i.name).includes(name)) {
      throw new ConflictError("Outfit with this name already exists.");
    }

    if (
      pet.outfits
        .map((i) => JSON.stringify({ ...i, name: undefined }))
        .includes(JSON.stringify({ ...pet.appearance, _id: undefined }))
    ) {
      throw new ConflictError("Similar outfit already exists.");
    }

    await PetDAO.saveOutfit(petId, appearance, name);
  }

  static async deleteOutfit(petId: string, name: string) {
    validatePetId(petId);
    nameIsValid(name);

    const pet = (await PetDAO.getPetByPetId(petId))?.toObject();
    if (!pet) {
      throw new NotFoundError("This pet does not exist.");
    }

    if (!pet.outfits.map((i) => i.name).includes(name)) {
      throw new NotFoundError("Outfit not found.");
    }

    await PetDAO.deleteOutfit(petId, name);
  }
}

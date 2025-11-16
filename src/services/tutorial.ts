import PetDAO from "@/db/actions/pets";
import UserDAO from "@/db/actions/user";
import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { IllegalOperationError, NotFoundError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";
import { Types } from "mongoose";
import BagDAO from "@/db/actions/bag";

const STARTER_COIN_MINIMUM = 100;
const TUTORIAL_MEDICATION_ID = "TUTORIAL";

const toWithIdPet = (
  pet: Pet & { _id: { toString(): string } },
): WithId<Pet> => ({
  ...pet,
  _id: pet._id.toString(),
});

export default class TutorialService {
  static async setupTutorialMedication(userId: string): Promise<string> {
    const tutorialCompleted = await UserDAO.getTutorialStatus(userId);
    if (tutorialCompleted) {
      throw new IllegalOperationError("Tutorial already completed");
    }

    const existingMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        TUTORIAL_MEDICATION_ID,
        userId,
      );

    const now = new Date();
    const futureTime = new Date(now.getTime() + 10 * 60 * 1000);
    const hours = futureTime.getHours().toString().padStart(2, "0");
    const minutes = futureTime.getMinutes().toString().padStart(2, "0");
    const doseTime = `${hours}:${minutes}`;

    if (existingMedication) {
      await MedicationDAO.updateMedicationById(
        existingMedication._id.toString(),
        {
          doseTimes: [doseTime],
        },
      );
      return existingMedication._id.toString();
    }

    const tutorialMedication = {
      userId: new Types.ObjectId(userId),
      customMedicationId: TUTORIAL_MEDICATION_ID,
      formOfMedication: "Pill" as const,
      dosageAmount: "1 pill",
      doseTimes: [doseTime],
      repeatUnit: "Day" as const,
      repeatInterval: 1,
      repeatWeeklyOn: [],
      dosesUnit: "Doses" as const,
      notificationFrequency: "Every Dose" as const,
      notes: "Practice medication for tutorial",
      includeTimes: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const newMedication =
      await MedicationDAO.createNewMedication(tutorialMedication);
    return newMedication._id.toString();
  }

  static async ensureStarterCoins(userId: string): Promise<WithId<Pet>> {
    const tutorialCompleted = await UserDAO.getTutorialStatus(userId);
    if (tutorialCompleted) {
      throw new IllegalOperationError("Tutorial already completed");
    }

    const petDocument = await PetDAO.getPetByUserId(userId);
    if (!petDocument) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    const petId = petDocument._id.toString();
    const foodItems = await BagDAO.getBagItemsByPetIdAndType(petId, "food");
    if (foodItems.length > 0) {
      return toWithIdPet(petDocument.toObject());
    }

    if (petDocument.coins >= STARTER_COIN_MINIMUM) {
      return toWithIdPet(petDocument.toObject());
    }

    await PetDAO.updatePetByPetId(petId, {
      coins: STARTER_COIN_MINIMUM,
    });

    return toWithIdPet({
      ...petDocument.toObject(),
      coins: STARTER_COIN_MINIMUM,
    });
  }

  static async getTutorialProgress(userId: string): Promise<{
    hasPurchasedFood: boolean;
    hasTakenTutorialMedication: boolean;
    hasFedPet: boolean;
  }> {
    const tutorialCompleted = await UserDAO.getTutorialStatus(userId);
    if (tutorialCompleted) {
      return {
        hasPurchasedFood: true,
        hasTakenTutorialMedication: true,
        hasFedPet: true,
      };
    }

    const petDocument = await PetDAO.getPetByUserId(userId);
    if (!petDocument) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    const petId = petDocument._id.toString();

    // Check if user has purchased food
    const foodItems = await BagDAO.getBagItemsByPetIdAndType(petId, "food");
    const hasPurchasedFood = foodItems.length > 0;

    // Check if tutorial medication has been logged
    let hasTakenTutorialMedication = false;
    const tutorialMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        TUTORIAL_MEDICATION_ID,
        userId,
      );
    if (tutorialMedication) {
      const logs = await MedicationDAO.getMedicationLogs(
        tutorialMedication._id.toString(),
      );
      hasTakenTutorialMedication = logs.length > 0;
    }

    // Check if pet has been fed (XP gained > 0, since feeding is the only way to gain XP)
    const hasFedPet = petDocument.xpGained > 0;

    return {
      hasPurchasedFood,
      hasTakenTutorialMedication,
      hasFedPet,
    };
  }
}

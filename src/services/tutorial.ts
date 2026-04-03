import PetDAO from "@/db/actions/pets";
import UserDAO from "@/db/actions/user";
import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";
import ERRORS from "@/utils/errorMessages";
import { NotFoundError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";
import { Types } from "mongoose";
import BagDAO from "@/db/actions/bag";

const STARTER_COIN_MINIMUM = 100;
const TUTORIAL_MEDICATION_ID = "PRACTICE DOSE";

const toWithIdPet = (
  pet: Pet & { _id: { toString(): string } },
): WithId<Pet> => ({
  ...pet,
  _id: pet._id.toString(),
});

export default class TutorialService {
  static async setupTutorialMedication(userId: string): Promise<{
    medicationId: string;
    scheduledDoseTime: string;
  }> {
    const existingMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        TUTORIAL_MEDICATION_ID,
        userId,
      );

    const now = new Date();
    const futureTime = new Date(now.getTime() + 10 * 60 * 1000);

    const nowDay = now.getDate();
    const futureDay = futureTime.getDate();
    const crossesMidnight = futureDay !== nowDay;

    const hours = futureTime.getHours().toString().padStart(2, "0");
    const minutes = futureTime.getMinutes().toString().padStart(2, "0");
    const doseTime = `${hours}:${minutes}`;

    const createdAt = crossesMidnight ? futureTime : now;
    if (existingMedication) {
      await MedicationDAO.updateMedicationById(
        existingMedication._id.toString(),
        {
          doseTimes: [doseTime],
          createdAt: createdAt,
        },
      );
      return {
        medicationId: existingMedication._id.toString(),
        scheduledDoseTime: doseTime,
      };
    }

    const newMedication = await MedicationDAO.createNewMedication({
      userId: new Types.ObjectId(userId),
      customMedicationId: TUTORIAL_MEDICATION_ID,
      formOfMedication: "Pill" as const,
      dosageAmount: "0 pills",
      doseTimes: [doseTime],
      repeatUnit: "Day" as const,
      repeatInterval: 1,
      repeatWeeklyOn: [],
      dosesUnit: "Doses" as const,
      notificationFrequency: "Every Dose" as const,
      includeTimes: true,
      notes: "practice dose",
      createdAt: createdAt,
      updatedAt: new Date(),
    });
    return {
      medicationId: newMedication._id.toString(),
      scheduledDoseTime: doseTime,
    };
  }

  static async resetTutorialArtifacts(userId: string): Promise<void> {
    const tutorialMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        TUTORIAL_MEDICATION_ID,
        userId,
      );

    if (!tutorialMedication) {
      return;
    }

    await MedicationDAO.deleteMedicationArtifactsByMedicationIds([
      tutorialMedication._id,
    ]);
    await MedicationDAO.deleteMedicationById(tutorialMedication._id);
  }

  static async restoreReplayCoins(
    userId: string,
    restoreCoins: number,
  ): Promise<void> {
    await this.restoreReplayPetState(userId, {
      coins: restoreCoins,
    });
  }

  static async restoreReplayPetState(
    userId: string,
    state: {
      coins?: number;
      xpGained?: number;
      xpLevel?: number;
      food?: number;
      lastFedAt?: Date | null;
    },
  ): Promise<void> {
    const petDocument = await PetDAO.getPetByUserId(userId);
    if (!petDocument) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    const normalizedState = {
      ...state,
      lastFedAt: state.lastFedAt ?? undefined,
    };

    await PetDAO.updatePetByPetId(petDocument._id.toString(), {
      ...normalizedState,
    });
  }

  static async ensureStarterCoins(userId: string): Promise<WithId<Pet>> {
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
    const tutorialStatus = await UserDAO.getTutorialStatus(userId);
    if (tutorialStatus.initialTutorialStage === "complete") {
      return {
        hasPurchasedFood: true,
        hasTakenTutorialMedication: true,
        hasFedPet: true,
      };
    }

    const petDocument = await PetDAO.getPetByUserId(userId);
    if (!petDocument) {
      return {
        hasPurchasedFood: false,
        hasTakenTutorialMedication: false,
        hasFedPet: false,
      };
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

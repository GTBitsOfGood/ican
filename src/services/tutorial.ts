import PetDAO from "@/db/actions/pets";
import UserDAO from "@/db/actions/user";
import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";
import { LEVEL_THRESHOLD } from "@/utils/constants";
import ERRORS from "@/utils/errorMessages";
import { IllegalOperationError, NotFoundError } from "@/types/exceptions";
import MedicationDAO from "@/db/actions/medication";
import { Types } from "mongoose";
import MedicationService from "./medication";

const STARTER_COIN_MINIMUM = 100;
const PRACTICE_DOSE_XP = 50;
const PRACTICE_DOSE_COINS = 10;
// const PRACTICE_DOSE_FOOD = 1;
const LEVEL_UP_COIN_REWARD = 100;
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

    if (petDocument.coins >= STARTER_COIN_MINIMUM) {
      return toWithIdPet(petDocument.toObject());
    }

    await PetDAO.updatePetByPetId(petDocument._id.toString(), {
      coins: STARTER_COIN_MINIMUM,
    });

    return toWithIdPet({
      ...petDocument.toObject(),
      coins: STARTER_COIN_MINIMUM,
    });
  }

  static async grantPracticeDoseReward(userId: string): Promise<WithId<Pet>> {
    const tutorialCompleted = await UserDAO.getTutorialStatus(userId);
    if (tutorialCompleted) {
      throw new IllegalOperationError("Tutorial already completed");
    }

    const tutorialMedication =
      await MedicationDAO.getUserMedicationByCustomMedicationId(
        TUTORIAL_MEDICATION_ID,
        userId,
      );

    if (!tutorialMedication) {
      throw new NotFoundError("Tutorial medication not found");
    }

    const medicationId = tutorialMedication._id.toString();
    const localTime = new Date().toISOString();

    await MedicationService.createMedicationCheckIn(medicationId, localTime);
    await MedicationService.createMedicationLog(medicationId, localTime);

    const petDocument = await PetDAO.getPetByUserId(userId);
    if (!petDocument) {
      throw new NotFoundError(ERRORS.PET.NOT_FOUND);
    }

    let xpGained = petDocument.xpGained + PRACTICE_DOSE_XP;
    let xpLevel = petDocument.xpLevel;
    let bonusCoins = PRACTICE_DOSE_COINS;

    while (xpGained >= LEVEL_THRESHOLD) {
      xpGained -= LEVEL_THRESHOLD;
      xpLevel += 1;
      bonusCoins += LEVEL_UP_COIN_REWARD;
    }

    const updatedFields = {
      xpGained,
      xpLevel,
      coins: petDocument.coins + bonusCoins,
    } as const;

    await PetDAO.updatePetByPetId(petDocument._id.toString(), updatedFields);

    return toWithIdPet({
      ...petDocument.toObject(),
      ...updatedFields,
    });
  }
}

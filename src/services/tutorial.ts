import PetDAO from "@/db/actions/pets";
import UserDAO from "@/db/actions/user";
import { Pet } from "@/db/models/pet";
import { WithId } from "@/types/models";
import { LEVEL_THRESHOLD } from "@/utils/constants";
import ERRORS from "@/utils/errorMessages";
import { IllegalOperationError, NotFoundError } from "@/types/exceptions";

const STARTER_COIN_MINIMUM = 100;
const PRACTICE_DOSE_XP = 50;
const PRACTICE_DOSE_COINS = 10;
const PRACTICE_DOSE_FOOD = 1;
const LEVEL_UP_COIN_REWARD = 100;

const toWithIdPet = (
  pet: Pet & { _id: { toString(): string } },
): WithId<Pet> => ({
  ...pet,
  _id: pet._id.toString(),
});

export default class TutorialService {
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
      food: petDocument.food + PRACTICE_DOSE_FOOD,
    } as const;

    await PetDAO.updatePetByPetId(petDocument._id.toString(), updatedFields);

    return toWithIdPet({
      ...petDocument.toObject(),
      ...updatedFields,
    });
  }
}

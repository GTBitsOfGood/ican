import { NotFoundError } from "@/types/exceptions";
import UserDAO from "@/db/actions/user";
import ERRORS from "@/utils/errorMessages";
import { validateDeleteUser } from "@/utils/serviceUtils/authServiceUtil";
import MedicationDAO from "@/db/actions/medication";
import PetDAO from "@/db/actions/pets";
import BagDAO from "@/db/actions/bag";
import SettingsDAO from "@/db/actions/settings";
import NotificationDAO from "@/db/actions/notification";
import ForgotPasswordCodeDAO from "@/db/actions/forgotPasswordCodes";
import TutorialService from "./tutorial";
import {
  TutorialMedicationType,
  TutorialMode,
  TutorialState,
  TutorialStatus,
} from "@/types/user";

export default class UserService {
  static async deleteUser(userId: string) {
    validateDeleteUser({ userId });

    const user = await UserDAO.getUserFromId(userId);
    if (!user) {
      throw new NotFoundError(ERRORS.USER.NOT_FOUND);
    }

    const pet = await PetDAO.getPetByUserId(userId);
    const medications = await MedicationDAO.getMedicationsByUserId(userId);
    const medicationIds = medications.map((medication) => medication._id);

    if (pet) {
      await BagDAO.deleteBagItemsByPetId(pet._id);
    }

    if (medicationIds.length > 0) {
      await MedicationDAO.deleteMedicationArtifactsByMedicationIds(
        medicationIds,
      );
    }

    await NotificationDAO.deleteNotificationsByUserId(userId);
    await ForgotPasswordCodeDAO.deleteForgotPasswordCodesByUserId(userId);
    await SettingsDAO.deleteSettingsByUserId(userId);

    if (medicationIds.length > 0) {
      await MedicationDAO.deleteMedicationsByUserId(userId);
    }

    if (pet) {
      await PetDAO.deletePetByUserId(userId);
    }

    await UserDAO.deleteUserFromId(userId);
  }

  static async getOnboardingStatus(userId: string): Promise<boolean> {
    return await UserDAO.getOnboardingStatus(userId);
  }

  static async updateOnboardingStatus(
    userId: string,
    isOnboarded: boolean,
  ): Promise<void> {
    await UserDAO.updateOnboardingStatus(userId, isOnboarded);
  }

  static async getTutorialStatus(userId: string): Promise<TutorialStatus> {
    return await UserDAO.getTutorialStatus(userId);
  }

  static async updateTutorialStatus(
    userId: string,
    status: {
      tutorialCompleted?: boolean;
      tutorialState: TutorialState;
      tutorialMode: TutorialMode | null;
      tutorialStep?: number;
      tutorialMedicationType?: TutorialMedicationType | null;
      tutorialShouldShowMedicationDrag?: boolean;
    },
  ): Promise<void> {
    await UserDAO.updateTutorialStatus(userId, status);

    if (status.tutorialState === "complete" && status.tutorialMode === null) {
      await TutorialService.resetTutorialArtifacts(userId);
    }
  }

  static async getUserProfile(userId: string): Promise<{
    name: string;
    email: string;
  }> {
    return await UserDAO.getUserProfile(userId);
  }
}

import fetchHTTPClient from "@/http/fetchHTTPClient";
import { WithId } from "@/types/models";
import { Pet } from "@/types/pet";

export interface TutorialProgress {
  hasPurchasedFood: boolean;
  hasTakenTutorialMedication: boolean;
  hasFedPet: boolean;
}

export interface ResetTutorialBody {
  restorePetState?: Pick<
    Pet,
    "coins" | "xpGained" | "xpLevel" | "food" | "lastFedAt"
  > | null;
  setCoins?: number | null;
}

export interface TutorialMedicationSetup {
  medicationId: string;
  scheduledDoseTime: string;
}

export default class TutorialHTTPClient {
  static async getTutorialProgress(): Promise<TutorialProgress> {
    return fetchHTTPClient<TutorialProgress>("/tutorial/progress", {
      method: "GET",
      credentials: "include",
    });
  }

  static async setupTutorialMedication(): Promise<TutorialMedicationSetup> {
    return fetchHTTPClient<TutorialMedicationSetup>("/tutorial/medication", {
      method: "PUT",
      credentials: "include",
      body: JSON.stringify({}),
    });
  }

  static async ensureStarterKit(): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>("/tutorial/starter-kit", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    });
  }

  static async resetTutorial(
    body: ResetTutorialBody = {},
  ): Promise<{ success: boolean }> {
    return fetchHTTPClient<{ success: boolean }>("/tutorial/reset", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(body),
    });
  }
}

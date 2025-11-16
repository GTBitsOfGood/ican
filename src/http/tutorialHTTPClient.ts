import fetchHTTPClient from "@/http/fetchHTTPClient";
import { WithId } from "@/types/models";
import { Pet } from "@/types/pet";

export interface TutorialProgress {
  hasPurchasedFood: boolean;
  hasTakenTutorialMedication: boolean;
  hasFedPet: boolean;
}

export default class TutorialHTTPClient {
  static async getTutorialProgress(): Promise<TutorialProgress> {
    return fetchHTTPClient<TutorialProgress>("/tutorial/progress", {
      method: "GET",
      credentials: "include",
    });
  }

  static async setupTutorialMedication(): Promise<{ medicationId: string }> {
    return fetchHTTPClient<{ medicationId: string }>("/tutorial/medication", {
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
}

import fetchHTTPClient from "@/http/fetchHTTPClient";
import { WithId } from "@/types/models";
import { Pet } from "@/types/pet";

export default class TutorialHTTPClient {
  static async ensureStarterKit(): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>("/tutorial/starter-kit", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    });
  }

  static async grantPracticeDoseReward(): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>("/tutorial/practice-dose", {
      method: "POST",
      credentials: "include",
      body: JSON.stringify({}),
    });
  }
}

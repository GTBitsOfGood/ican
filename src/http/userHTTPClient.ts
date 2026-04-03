import fetchHTTPClient from "./fetchHTTPClient";
import { TutorialStatus } from "@/types/user";

export interface UpdateTutorialStatusBody {
  initialTutorialStage: TutorialStatus["initialTutorialStage"];
}

export default class UserHTTPClient {
  static async deleteAccount(userId: string): Promise<void> {
    return await fetchHTTPClient(`/users/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  static async getOnboardingStatus(
    userId: string,
  ): Promise<{ isOnboarded: boolean }> {
    return await fetchHTTPClient(`/users/${userId}/onboarding-status`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateOnboardingStatus(
    userId: string,
    isOnboarded: boolean,
  ): Promise<{ success: boolean }> {
    return await fetchHTTPClient(`/users/${userId}/onboarding-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isOnboarded }),
    });
  }

  static async getTutorialStatus(userId: string): Promise<TutorialStatus> {
    return await fetchHTTPClient(`/users/${userId}/tutorial-status`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateTutorialStatus(
    userId: string,
    body: UpdateTutorialStatusBody,
  ): Promise<{ success: boolean }> {
    return await fetchHTTPClient(`/users/${userId}/tutorial-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(body),
    });
  }

  static async getProfile(userId: string): Promise<{
    name: string;
    email: string;
  }> {
    return await fetchHTTPClient(`/users/${userId}/profile`, {
      method: "GET",
      credentials: "include",
    });
  }
}

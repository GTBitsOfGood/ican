import fetchHTTPClient from "./fetchHTTPClient";

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

  static async getTutorialStatus(
    userId: string,
  ): Promise<{ tutorial_completed: boolean }> {
    return await fetchHTTPClient(`/users/${userId}/tutorial-status`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateTutorialStatus(
    userId: string,
    tutorial_completed: boolean,
  ): Promise<{ success: boolean }> {
    return await fetchHTTPClient(`/users/${userId}/tutorial-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ tutorial_completed }),
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

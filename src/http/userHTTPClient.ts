import fetchHTTPClient from "./fetchHTTPClient";

export default class UserHTTPClient {
  static async deleteAccount(userId: string): Promise<void> {
    return await fetchHTTPClient(`/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  static async getOnboardingStatus(
    userId: string,
  ): Promise<{ isOnboarded: boolean }> {
    return await fetchHTTPClient(`/user/${userId}/onboarding-status`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updateOnboardingStatus(
    userId: string,
    isOnboarded: boolean,
  ): Promise<{ success: boolean }> {
    return await fetchHTTPClient(`/user/${userId}/onboarding-status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ isOnboarded }),
    });
  }
}

import fetchHTTPClient from "./fetchHTTPClient";

export default class UserHTTPClient {
  static async deleteAccount(userId: string): Promise<void> {
    return await fetchHTTPClient(`/user/${userId}`, {
      method: "DELETE",
      credentials: "include",
    });
  }
}

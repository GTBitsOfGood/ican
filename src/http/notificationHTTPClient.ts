import fetchHTTPClient from "./fetchHTTPClient";

export default class NotificationHTTPClient {
  static async markDelivered(notificationId: string) {
    return fetchHTTPClient<void>(`/notifications/${notificationId}/deliver`, {
      method: "POST",
      body: JSON.stringify({}),
      credentials: "include",
    });
  }
}

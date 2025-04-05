import fetchHTTPClient from "./fetchHTTPClient";
import { InventoryItem } from "@/types/inventory";

export interface PurchaseItemBody {
  petId: string;
  name: string;
  type: string;
}

export default class InventoryHTTPClient {
  static async purchaseItem(requestBody: PurchaseItemBody): Promise<void> {
    return fetchHTTPClient<void>("/store/purchase-item", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async getPetBag(
    petId: string,
  ): Promise<Record<string, InventoryItem[]>> {
    return fetchHTTPClient<Record<string, InventoryItem[]>>(`/bag/${petId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}

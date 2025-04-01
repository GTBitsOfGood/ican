import fetchHTTPClient from "./fetchHTTPClient";
import { InventoryItem } from "@/types/inventory";

export interface PurchaseItemBody {
  petId: string;
  name: string;
  type: string;
}

export interface EquipItemBody {
  name: string;
  type: string;
}

export interface UnequipBody {
  attribute: string;
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

  static async equipItem(
    petId: string,
    name: string,
    type: string,
  ): Promise<void> {
    const EquipItemRequestBody: EquipItemBody = {
      name,
      type,
    };
    return fetchHTTPClient<void>(`/pet/equip-item/${petId}`, {
      method: "GET",
      body: JSON.stringify(EquipItemRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async unequipItem(petId: string, attribute: string): Promise<void> {
    const UnequipRequestBody: UnequipBody = {
      attribute,
    };
    return fetchHTTPClient<void>(`/pet/unequip/${petId}`, {
      method: "GET",
      body: JSON.stringify(UnequipRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}

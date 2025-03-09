import { WithId } from "mongodb";
import fetchHTTPClient from "./fetchHTTPClient";
import { BagItem } from "@/db/models";

export interface PurchaseItemBody {
  petId: string;
  itemName: string;
}

export interface EquipItemBody {
  itemName: string;
}

export default class StoreHTTPClient {
  static async purchaseItem(petId: string, itemName: string): Promise<void> {
    const PurchaseItemRequestBody: PurchaseItemBody = {
      petId,
      itemName,
    };
    return fetchHTTPClient<void>("/store/purchase-item", {
      method: "POST",
      body: JSON.stringify(PurchaseItemRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async getPetBag(petId: string): Promise<WithId<BagItem>[]> {
    return fetchHTTPClient<WithId<BagItem>[]>(`/bag/${petId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async equipItem(petId: string, itemName: string): Promise<void> {
    const EquipItemRequestBody: EquipItemBody = {
      itemName,
    };
    return fetchHTTPClient<void>(`/bag/${petId}`, {
      method: "GET",
      body: JSON.stringify(EquipItemRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}

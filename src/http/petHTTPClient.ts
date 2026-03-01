import fetchHTTPClient from "@/http/fetchHTTPClient";
import { WithId } from "@/types/models";
import { Pet, PetType } from "@/types/pet";
import { Appearance } from "@/db/models/pet";

export interface UpdatePetBody {
  name: string;
}

export interface CreatePetBody {
  name: string;
  userId: string;
  petType: PetType;
}

export interface EquipItemBody {
  name: string;
  type: string;
}

export interface UnequipBody {
  attribute: string;
}

export default class PetHTTPClient {
  static async createPet(
    name: string,
    userId: string,
    petType: PetType,
  ): Promise<WithId<Pet>> {
    const CreatePetBodyRequestBody: CreatePetBody = {
      name,
      userId,
      petType,
    };
    return fetchHTTPClient<WithId<Pet>>(`/users/${userId}/pets`, {
      method: "POST",
      body: JSON.stringify(CreatePetBodyRequestBody),
      credentials: "include",
    });
  }

  static async getPet(userId: string): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>(`/users/${userId}/pets`, {
      method: "GET",
      credentials: "include",
    });
  }

  static async updatePet(name: string, userId: string): Promise<void> {
    const updatePetRequestBody: UpdatePetBody = { name };
    return fetchHTTPClient<void>(`/users/${userId}/pets`, {
      method: "PATCH",
      body: JSON.stringify(updatePetRequestBody),
      credentials: "include",
    });
  }

  static async deletePet(userId: string): Promise<void> {
    return fetchHTTPClient<void>(`/users/${userId}/pets`, {
      method: "DELETE",
      credentials: "include",
    });
  }

  static async feedPet(userId: string, petId: string): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>(`/users/${userId}/pets/${petId}/feed`, {
      method: "PATCH",
      body: JSON.stringify({}),
      credentials: "include",
    });
  }

  static async equipItem(
    userId: string,
    petId: string,
    name: string,
    type: string,
  ): Promise<void> {
    const EquipItemRequestBody: EquipItemBody = {
      name,
      type,
    };
    return fetchHTTPClient<void>(`/users/${userId}/pets/${petId}/equip-item`, {
      method: "PATCH",
      body: JSON.stringify(EquipItemRequestBody),
      credentials: "include",
    });
  }

  static async unequipItem(
    userId: string,
    petId: string,
    attribute: string,
  ): Promise<void> {
    const UnequipRequestBody: UnequipBody = {
      attribute,
    };
    return fetchHTTPClient<void>(
      `/users/${userId}/pets/${petId}/unequip-item`,
      {
        method: "PATCH",
        body: JSON.stringify(UnequipRequestBody),
        credentials: "include",
      },
    );
  }

  static async equipOutfit(
    userId: string,
    petId: string,
    appearance: Appearance,
  ): Promise<void> {
    return fetchHTTPClient<void>(
      `/users/${userId}/pets/${petId}/equip-outfit`,
      {
        method: "PATCH",
        body: JSON.stringify(appearance),
        credentials: "include",
      },
    );
  }

  static async saveOutfit(
    userId: string,
    petId: string,
    name: string,
    appearance: Appearance,
  ): Promise<void> {
    return fetchHTTPClient<void>(
      `/users/${userId}/pets/${petId}/outfit/${name}`,
      {
        method: "POST",
        body: JSON.stringify(appearance),
        credentials: "include",
      },
    );
  }

  static async deleteOutfit(
    userId: string,
    petId: string,
    name: string,
  ): Promise<void> {
    return fetchHTTPClient<void>(
      `/users/${userId}/pets/${petId}/outfit/${name}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
  }
}

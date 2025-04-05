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
    return fetchHTTPClient<WithId<Pet>>("/pets", {
      method: "POST",
      body: JSON.stringify(CreatePetBodyRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async getPet(userId: string): Promise<WithId<Pet>> {
    return fetchHTTPClient<WithId<Pet>>(`/pets/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async updatePet(name: string, userId: string): Promise<void> {
    const updatePetRequestBody: UpdatePetBody = { name };
    return fetchHTTPClient<void>(`/pets/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePetRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async deletePet(userId: string): Promise<void> {
    return fetchHTTPClient<void>(`/pets/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async feedPet(petId: string): Promise<void> {
    return fetchHTTPClient<void>(`/pet/${petId}/feed`, {
      method: "PATCH",
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
    return fetchHTTPClient<void>(`/pet/${petId}/equip-item`, {
      method: "PATCH",
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
    return fetchHTTPClient<void>(`/pet/${petId}/unequip-item`, {
      method: "PATCH",
      body: JSON.stringify(UnequipRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async equipOutfit(
    petId: string,
    appearance: Appearance,
  ): Promise<void> {
    return fetchHTTPClient<void>(`/pet/${petId}/equip-outfit`, {
      method: "PATCH",
      body: JSON.stringify(appearance),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async saveOutfit(
    petId: string,
    name: string,
    appearance: Appearance,
  ): Promise<void> {
    return fetchHTTPClient<void>(`/pet/${petId}/outfit/${name}`, {
      method: "POST",
      body: JSON.stringify(appearance),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }

  static async deleteOutfit(petId: string, name: string): Promise<void> {
    return fetchHTTPClient<void>(`/pet/${petId}/outfit/${name}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  }
}

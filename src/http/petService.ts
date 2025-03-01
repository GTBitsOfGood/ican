import fetchService from "@/http/fetchService";
import { WithId } from "@/types/models";
import { Pet, PetType } from "@/types/pet";

export interface UpdatePetBody {
  name: string;
}

export interface CreatePetBody {
  name: string;
  userId: string;
  petType: PetType;
}

export const petService = {
  createPet: async (
    name: string,
    userId: string,
    petType: PetType,
  ): Promise<WithId<Pet>> => {
    const CreatePetBodyRequestBody: CreatePetBody = {
      name,
      userId,
      petType,
    };
    return fetchService<WithId<Pet>>("/pets", {
      method: "POST",
      body: JSON.stringify(CreatePetBodyRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  getPet: async (userId: string): Promise<WithId<Pet>> => {
    return fetchService<WithId<Pet>>(`/pets/${userId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  updatePet: async (name: string, userId: string): Promise<void> => {
    const updatePetRequestBody: UpdatePetBody = { name };
    return fetchService<void>(`/pets/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePetRequestBody),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },

  deletePet: async (userId: string): Promise<void> => {
    return fetchService<void>(`/pets/${userId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
  },
};

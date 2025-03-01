import fetchService from "@/http/fetchService";
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
  ): Promise<Pet> => {
    const CreatePetBodyRequestBody: CreatePetBody = {
      name,
      userId,
      petType,
    };
    return fetchService<Pet>("/pets", {
      method: "POST",
      body: JSON.stringify(CreatePetBodyRequestBody),
    });
  },

  getPet: async (userId: string): Promise<Pet> => {
    return fetchService<Pet>(`/pets/${userId}`, {
      method: "GET",
    });
  },

  updatePet: async (name: string, userId: string): Promise<void> => {
    const updatePetRequestBody: UpdatePetBody = { name };
    return fetchService<void>(`/pets/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePetRequestBody),
    });
  },

  deletePet: async (userId: string): Promise<void> => {
    return fetchService<void>(`/pets/${userId}`, {
      method: "DELETE",
    });
  },

  feedPet: async (petId: string): Promise<void> => {
    return fetchService<void>(`/pet/${petId}/feed`, {
      method: "PATCH",
    });
  },
};

import { fetchAPI } from "@/services/fetchService";
import { Pet } from "@/types/pet";

interface CreatePetBodyRequestBody {
  name: string;
  userId: string;
}

interface UpdatePetRequestBody {
  name: string;
}

export const petService = {
  createPet: async (name: string, userId: string): Promise<Pet> => {
    const CreatePetBodyRequestBody: CreatePetBodyRequestBody = { name, userId };
    return fetchAPI<Pet>("/pets", {
      method: "POST",
      body: JSON.stringify(CreatePetBodyRequestBody),
    });
  },

  getPet: async (userId: string): Promise<Pet> => {
    return fetchAPI<Pet>(`/pets/${userId}`, {
      method: "GET",
    });
  },

  updatePet: async (name: string, userId: string): Promise<void> => {
    const updatePetRequestBody: UpdatePetRequestBody = { name };
    return fetchAPI<void>(`/pets/${userId}`, {
      method: "PATCH",
      body: JSON.stringify(updatePetRequestBody),
    });
  },

  deletePet: async (userId: string): Promise<void> => {
    return fetchAPI<void>(`/pets/${userId}`, {
      method: "DELETE",
    });
  },
};

import { fetchAPI } from "@/services/fetchAPI";
import { Pet } from "@/types/pet";

// Should I make every function take an object or should I just keep it simple with something like 
// createPet: async (name: string, userID: string) because I kind of don't like how half the calls require an object while other half doesn't currently.

// Should we explicitly deal with status codes ex: Status Code: 200 for get?

interface PetIdentifier {
  name: string
  userID: string
};

export const petService = {
  // Try catch to handle errors in here + error handling?
  createPet: async (petIdentifier: PetIdentifier): Promise<Pet> => {
    return fetchAPI<Pet>('/pets', {
      method: 'POST',
      // Should I stringify body here or in fetchAPI
      body: JSON.stringify(petIdentifier)
    });
  },

  getPet: async (userId: string): Promise<Pet> => {
    return fetchAPI<Pet>(`/pets/${userId}`, {
      method: 'GET'
    });
  },

  updatePet: async (petIdentifier: PetIdentifier): Promise<void> => {
    return fetchAPI<void>(`/pets/${petIdentifier.userID}`, {
      method: 'PATCH',
      body: JSON.stringify(petIdentifier.name)
    });
  },

  deletePet: async (userId: string): Promise<void> => {
    return fetchAPI<void>(`/pets/${userId}`, {
      method: 'DELETE'
    });
  }
};

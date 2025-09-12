import PetHTTPClient from "@/http/petHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "../UserContext";
import { Pet, PetType } from "@/types/pet";
import { WithId } from "@/types/models";
import { Appearance } from "@/db/models/pet";

export const PET_QUERY_KEYS = {
  pet: (userId: string) => ["pet", userId] as const,
} as const;

type PetQueryData = WithId<Pet> | null;

export const usePet = () => {
  const { userId } = useUser();

  return useQuery<PetQueryData>({
    queryKey: PET_QUERY_KEYS.pet(userId || ""),
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required to fetch pet data");
      const petData = await PetHTTPClient.getPet(userId);
      return petData || null;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePet = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ name, petType }: { name: string; petType: PetType }) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return PetHTTPClient.createPet(name, userId, petType);
    },
    onSuccess: (data) => {
      if (userId) {
        queryClient.setQueryData(PET_QUERY_KEYS.pet(userId), data);
      }
    },
  });
};

export const useUpdatePetName = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (name: string) => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return PetHTTPClient.updatePet(name, userId);
    },
    onMutate: async (newName: string) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      // Optimistic update
      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) => (old ? { ...old, name: newName } : old),
      );

      return { previousPet };
    },
    onError: (err, newName, context) => {
      if (userId && context?.previousPet !== undefined) {
        queryClient.setQueryData(
          PET_QUERY_KEYS.pet(userId),
          context.previousPet,
        );
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useDeletePet = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      if (!userId) {
        throw new Error("User ID is required");
      }
      return PetHTTPClient.deletePet(userId);
    },
    onSuccess: () => {
      if (userId) {
        queryClient.setQueryData(PET_QUERY_KEYS.pet(userId), null);
      }
    },
    onError: (error) => {
      console.error("Failed to delete pet:", error);
    },
  });
};

// Could potentially make this an optimistic update, however would be harder to maintain logic
export const useFeedPet = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (petId: string) => PetHTTPClient.feedPet(petId),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useEquipPetItem = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      name,
      type,
    }: {
      petId: string;
      name: string;
      type: string;
    }) => PetHTTPClient.equipItem(petId, name, type), // TODO Check for empty strings

    // Optimistic
    onMutate: async ({ name, type }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      // Optimistic
      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) =>
          old
            ? {
                ...old,
                appearance: {
                  ...old.appearance,
                  [type]: name,
                },
              }
            : old,
      );

      return { previousPet };
    },

    onError: (err, variables, context) => {
      if (userId && context?.previousPet !== undefined) {
        queryClient.setQueryData(
          PET_QUERY_KEYS.pet(userId),
          context.previousPet,
        );
      }
    },

    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useUnequipPetItem = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ petId, attribute }: { petId: string; attribute: string }) =>
      PetHTTPClient.unequipItem(petId, attribute),

    // Optimistic
    onMutate: async ({ attribute }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      // Optimistic
      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) =>
          old
            ? {
                ...old,
                appearance: {
                  ...old.appearance,
                  [attribute]: undefined,
                },
              }
            : old,
      );

      return { previousPet };
    },

    onError: (err, variables, context) => {
      if (userId && context?.previousPet !== undefined) {
        queryClient.setQueryData(
          PET_QUERY_KEYS.pet(userId),
          context.previousPet,
        );
      }
    },

    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useEquipPetOutfit = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      appearance,
    }: {
      petId: string;
      appearance: Appearance;
    }) => PetHTTPClient.equipOutfit(petId, appearance),

    // Optimistic
    onMutate: async ({ appearance }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      // Optimistic
      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) =>
          old
            ? {
                ...old,
                appearance,
              }
            : old,
      );

      return { previousPet };
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useSavePetOutfit = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      name,
      appearance,
    }: {
      petId: string;
      name: string;
      appearance: Appearance;
    }) => {
      if (!name || name.trim() === "") {
        throw new Error("Outfit name cannot be empty.");
      }

      return PetHTTPClient.saveOutfit(petId, name, appearance);
    },

    // Optimistic
    onMutate: async ({ name, appearance }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) => {
          if (!old) return old;

          const newOutfit = { name, appearance };

          const existingOutfitIndex = old.outfits.findIndex(
            (outfit) => outfit.name === name,
          );
          const newOutfits = [...old.outfits];

          if (existingOutfitIndex > -1) {
            newOutfits[existingOutfitIndex] = newOutfit;
          } else {
            newOutfits.push(newOutfit);
          }

          return {
            ...old,
            outfits: newOutfits,
          };
        },
      );

      return { previousPet };
    },
    onError: (err, variables, context) => {
      if (userId && context?.previousPet) {
        queryClient.setQueryData(
          PET_QUERY_KEYS.pet(userId),
          context.previousPet,
        );
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

export const useDeletePetOutfit = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      petId,
      outfitName,
    }: {
      petId: string;
      outfitName: string;
    }) => {
      if (!outfitName || outfitName.trim() === "") {
        throw new Error("Outfit name cannot be empty.");
      }
      return PetHTTPClient.deleteOutfit(petId, outfitName);
    },
    onMutate: async ({ outfitName }) => {
      if (!userId) return;

      await queryClient.cancelQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      const previousPet = queryClient.getQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
      );

      queryClient.setQueryData<PetQueryData>(
        PET_QUERY_KEYS.pet(userId),
        (old) =>
          old
            ? {
                ...old,
                outfits: old.outfits.filter(
                  (outfit) => outfit.name !== outfitName,
                ),
              }
            : old,
      );

      return { previousPet };
    },
    onError: (err, variables, context) => {
      if (userId && context?.previousPet) {
        queryClient.setQueryData(
          PET_QUERY_KEYS.pet(userId),
          context.previousPet,
        );
      }
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
      }
    },
  });
};

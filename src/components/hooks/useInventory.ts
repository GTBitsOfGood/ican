import InventoryHTTPClient from "@/http/inventoryHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PET_QUERY_KEYS } from "./usePet";
import { useUser } from "../UserContext";

export const INVENTORY_QUERY_KEYS = {
  petBag: (petId: string) => ["petBag", petId] as const,
  petFoods: (petId: string) => ["petFoods", petId] as const,
} as const;

export const usePetBag = (petId: string | undefined) => {
  return useQuery({
    queryKey: ["petBag", petId],
    queryFn: async () => {
      if (!petId) return null;
      const bag = await InventoryHTTPClient.getPetBag(petId);
      return bag || null;
    },
    enabled: !!petId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePetFoods = (petId: string | undefined) => {
  return useQuery({
    queryKey: INVENTORY_QUERY_KEYS.petFoods(petId || ""),
    queryFn: async () => {
      if (!petId) return [];
      return await InventoryHTTPClient.getPetFoods(petId);
    },
    enabled: !!petId,
    staleTime: 5 * 60 * 1000,
  });
};

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  const { userId } = useUser();

  return useMutation({
    mutationFn: InventoryHTTPClient.purchaseItem,
    onSettled: (_, __, variables) => {
      if (userId) {
        queryClient.invalidateQueries({ queryKey: PET_QUERY_KEYS.pet(userId) });
        queryClient.invalidateQueries({
          queryKey: INVENTORY_QUERY_KEYS.petBag(variables.petId),
        });
      }
    },
  });
};

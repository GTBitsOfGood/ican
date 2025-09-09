import PetHTTPClient from "@/http/petHTTPClient";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "./UserContext";

export const usePet = () => {
  const { userId } = useUser();

  return useQuery({
    queryKey: ["pet", userId],
    queryFn: () => {
      if (!userId) {
        // TODO Throw a more descriptive error.
        throw new Error("User ID is required");
      }
      return PetHTTPClient.getPet(userId);
    },
    enabled: !!userId,
  });
};

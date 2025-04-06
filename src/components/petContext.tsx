import PetHTTPClient from "@/http/petHTTPClient";
import { Pet } from "@/types/pet";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { useUser } from "./UserContext";
import { WithId } from "@/types/models";

interface PetContextType {
  pet: WithId<Pet> | null;
  setPet: Dispatch<SetStateAction<WithId<Pet> | null>>;
}

const PetContext = createContext<PetContextType | undefined>(undefined);

export const PetProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { userId } = useUser();
  const [pet, setPet] = useState<WithId<Pet> | null>(null);

  useEffect(() => {
    const getPetData = async () => {
      if (!userId) return;
      try {
        const pet = await PetHTTPClient.getPet(userId);
        if (pet) {
          setPet(pet);
          console.log("Fetched pet data:", pet);
        } else {
          console.log("No pet data found for userId:", userId);
        }
      } catch (error) {
        console.error("Error fetching pet data:", error);
      }
    };
    getPetData();
  }, [userId]);

  return (
    <PetContext.Provider value={{ pet, setPet }}>
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (context === undefined) {
    throw new Error("usePet must be used within a PetProvider");
  }
  return context;
};

import { useState } from "react";
import { useRouter } from "next/router";
import { PET_CHARACTERS, PetCharacter } from "@/lib/petCharacters";
import PetGrid from "@/components/petSelection/PetGrid";
import PetDetailPanel from "@/components/petSelection/PetDetailPanel";
import { useCreatePet } from "@/components/hooks/usePet";
import { useUser } from "@/components/UserContext";
import PetSelectionRoute from "@/components/PetSelectionRoute";

export default function FirstPetPage() {
  const [selectedCharacter, setSelectedCharacter] =
    useState<PetCharacter | null>(PET_CHARACTERS[0]); // Default to Dog (Paws!)
  const { userId } = useUser();
  const router = useRouter();
  const createPetMutation = useCreatePet();

  const handleCharacterSelect = (character: PetCharacter) => {
    setSelectedCharacter(character);
  };

  const handleSelectPet = async () => {
    if (!selectedCharacter || !userId) return;

    createPetMutation.mutate(
      {
        name: "My Pet", // Simple default name that user can change later
        petType: selectedCharacter.type,
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          console.error("Error creating pet:", error);
          // The user can retry by clicking Select again
        },
      },
    );
  };

  return (
    <PetSelectionRoute>
      <div
        className="min-h-screen flex flex-col"
        style={{ backgroundColor: "#4C539B" }}
      >
        {/* Header */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="bg-white border-4 border-black px-8 py-3 rounded-xl shadow-lg">
            <h1 className="text-2xl font-bold text-black font-pixelify">
              Select a Character
            </h1>
          </div>
        </div>

        {/* Main Content - Side by Side Layout */}
        <div className="flex-1 flex items-center justify-center px-4">
          <div className="w-full max-w-7xl flex flex-row gap-16 items-center justify-center">
            {/* Left Side - Pet Grid */}
            <div className="flex justify-center">
              <PetGrid
                characters={PET_CHARACTERS.filter(
                  (char) => char.type !== selectedCharacter?.type,
                )} // Show 4 unselected pets
                onCharacterSelect={handleCharacterSelect}
              />
            </div>

            {/* Right Side - Pet Details */}
            <div className="flex justify-center">
              <div
                className="p-12 rounded-2xl shadow-lg min-w-[500px]"
                style={{ backgroundColor: "#E6E8F9" }}
              >
                <PetDetailPanel
                  character={selectedCharacter}
                  onSelect={handleSelectPet}
                  isCreating={createPetMutation.isPending}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {createPetMutation.error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg">
            Failed to create pet. Please try again.
          </div>
        )}
      </div>
    </PetSelectionRoute>
  );
}

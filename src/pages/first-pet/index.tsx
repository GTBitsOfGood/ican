import { useState } from "react";
import { useRouter } from "next/router";
import { PET_CHARACTERS, PetCharacter } from "@/lib/petCharacters";
import PetGrid from "@/components/petSelection/PetGrid";
import PetDetailPanel from "@/components/petSelection/PetDetailPanel";
import { useCreatePet } from "@/components/hooks/usePet";
import { useUser } from "@/components/UserContext";
import AuthorizedRoute from "@/components/AuthorizedRoute";

export default function FirstPetPage() {
  // Start with Paws selected (index 0), show other 4 in grid
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [petPositions, setPetPositions] = useState([0, 1, 2, 3, 4]); // Original positions
  const { userId } = useUser();
  const router = useRouter();
  const createPetMutation = useCreatePet();

  const selectedCharacter = PET_CHARACTERS[selectedCharacterIndex];

  const handleCharacterSelect = (character: PetCharacter) => {
    const clickedIndex = PET_CHARACTERS.findIndex(
      (c) => c.type === character.type,
    );
    if (clickedIndex !== -1) {
      // Swap positions: clicked pet becomes selected, selected pet goes to clicked pet's position
      const newPositions = [...petPositions];
      const selectedPos = newPositions.indexOf(selectedCharacterIndex);
      const clickedPos = newPositions.indexOf(clickedIndex);

      // Swap the positions
      newPositions[selectedPos] = clickedIndex;
      newPositions[clickedPos] = selectedCharacterIndex;

      setPetPositions(newPositions);
      setSelectedCharacterIndex(clickedIndex);
    }
  };

  // Get the 4 characters that should be shown in the grid (not the selected one)
  const gridCharacters = petPositions
    .filter((index) => index !== selectedCharacterIndex)
    .map((index) => PET_CHARACTERS[index]);

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
    <AuthorizedRoute>
      <div className="min-h-screen flex" style={{ backgroundColor: "#4C539B" }}>
        {/* Left Side - Pet Grid with Header */}
        <div className="flex-1 flex flex-col justify-center px-8">
          <div className="flex justify-center">
            <div className="flex flex-col">
              {/* Header above grid - aligned with grid */}
              <div className="mb-6 flex justify-start">
                <div className="bg-white border-4 border-black px-6 py-3 rounded-xl shadow-lg">
                  <h1 className="text-lg font-bold text-black font-quantico uppercase">
                    SELECT A CHARACTER
                  </h1>
                </div>
              </div>

              <PetGrid
                characters={gridCharacters}
                onCharacterSelect={handleCharacterSelect}
              />
            </div>
          </div>
        </div>

        {/* Right Side - Pet Details */}
        <div className="w-[600px] bg-white flex items-center justify-center">
          <PetDetailPanel
            character={selectedCharacter}
            onSelect={handleSelectPet}
            isLoading={createPetMutation.isPending}
          />
        </div>

        {/* Error Display */}
        {createPetMutation.error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg">
            Failed to create pet. Please try again.
          </div>
        )}
      </div>
    </AuthorizedRoute>
  );
}

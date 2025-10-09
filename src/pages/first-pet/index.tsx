import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { PET_CHARACTERS, PetCharacter } from "@/lib/petCharacters";
import { useCreatePet } from "@/components/hooks/usePet";
import { useUser } from "@/components/UserContext";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { cn } from "@/lib/utils";

interface PetCharacterCardProps {
  character: PetCharacter;
  isSelected: boolean;
  onClick: () => void;
}

function PetCharacterCard({
  character,
  isSelected,
  onClick,
}: PetCharacterCardProps) {
  return (
    <div
      className={`
          cursor-pointer border-4 p-10 transition-all duration-200 w-80 h-80
          flex items-center justify-center
          ${
            isSelected
              ? "border-white bg-white/30 shadow-2xl scale-105"
              : "border-white/80 hover:border-white hover:bg-white/15 hover:scale-102"
          }
        `}
      style={{
        boxShadow: "4px 4px 0px 0px rgba(0, 0, 0, 0.3)",
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      }}
      onClick={onClick}
    >
      <Image
        src={character.image}
        alt={character.name}
        width={200}
        height={200}
      />
    </div>
  );
}

interface PetDetailPanelProps {
  character: PetCharacter | null;
  onSelect: () => void;
  isLoading: boolean;
}

function PetDetailPanel({
  character,
  onSelect,
  isLoading,
}: PetDetailPanelProps) {
  if (!character) {
    throw new Error("Character should never be null in PetDetailPanel");
  }

  return (
    <div className="flex flex-col items-center text-center text-black w-full px-12 py-16 bg-[#E6E8F9] h-full justify-between">
      <div className="flex flex-col gap-y-2">
        <h2 className="text-6xl font-bold font-quantico text-icanBlue-200">
          {character.name}
        </h2>
        <p className="text-base text-gray-600 font-quantico">
          *This name can be changed.
        </p>
      </div>

      <p className="text-2xl font-bold leading-relaxed font-quantico px-12 max-w-md text-icanBlue-200">
        {character.description}
      </p>

      <div className="">
        <Image
          src={character.image}
          alt={character.name}
          width={240}
          height={240}
        />
      </div>

      <button
        onClick={onSelect}
        disabled={isLoading}
        className={cn(
          "px-16 py-4 text-white font-bold text-2xl font-quantico transition-all duration-200 min-w-[180px] bg-icanBlue-200",
          isLoading
            ? "opacity-50 cursor-not-allowed"
            : "hover:opacity-90 active:scale-95",
        )}
      >
        {isLoading ? "Creating..." : "Select"}
      </button>
    </div>
  );
}

export default function FirstPetPage() {
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState(0);
  const [petPositions, setPetPositions] = useState([0, 1, 2, 3, 4]);
  const { userId } = useUser();
  const router = useRouter();
  const createPetMutation = useCreatePet();

  const selectedCharacter = PET_CHARACTERS[selectedCharacterIndex];

  const handleCharacterSelect = (character: PetCharacter) => {
    const clickedIndex = PET_CHARACTERS.findIndex(
      (c) => c.type === character.type,
    );
    if (clickedIndex !== -1) {
      const newPositions = [...petPositions];
      const selectedPos = newPositions.indexOf(selectedCharacterIndex);
      const clickedPos = newPositions.indexOf(clickedIndex);

      newPositions[selectedPos] = clickedIndex;
      newPositions[clickedPos] = selectedCharacterIndex;

      setPetPositions(newPositions);
      setSelectedCharacterIndex(clickedIndex);
    }
  };

  const gridCharacters = petPositions
    .filter((index) => index !== selectedCharacterIndex)
    .map((index) => PET_CHARACTERS[index]);

  const handleSelectPet = async () => {
    if (!selectedCharacter || !userId) return;

    createPetMutation.mutate(
      {
        name: selectedCharacter.name,
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
      <div className="min-h-screen flex bg-icanBlue-200">
        <div className="flex-1 flex flex-col justify-center px-8">
          <div className="flex justify-center">
            <div className="flex flex-col">
              <div className="mb-6 flex justify-start">
                <div className="bg-white border-4 border-black px-6 py-3 rounded-xl shadow-lg">
                  <h1 className="text-lg font-bold text-black font-quantico uppercase">
                    SELECT A CHARACTER
                  </h1>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                {gridCharacters.map((character) => (
                  <PetCharacterCard
                    key={character.type}
                    character={character}
                    isSelected={false}
                    onClick={() => handleCharacterSelect(character)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="w-[600px] bg-white flex items-center justify-center">
          <PetDetailPanel
            character={selectedCharacter}
            onSelect={handleSelectPet}
            isLoading={createPetMutation.isPending}
          />
        </div>

        {createPetMutation.error && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg">
            Unable to create your pet companion. Please try selecting again.
          </div>
        )}
      </div>
    </AuthorizedRoute>
  );
}

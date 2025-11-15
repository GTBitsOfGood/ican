import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { PET_CHARACTERS, PetCharacter } from "@/lib/petCharacters";
import { useCreatePet } from "@/components/hooks/usePet";
import { useUser } from "@/components/UserContext";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import NavigationArrow from "@/components/ui/NavigationArrow";
import BackButton from "@/components/ui/BackButton";
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
        width={175}
        height={175}
        className="object-contain"
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

  const handlePrevious = () => {
    if (selectedCharacterIndex > 0) {
      setSelectedCharacterIndex(selectedCharacterIndex - 1);
    }
  };

  const handleNext = () => {
    if (selectedCharacterIndex < PET_CHARACTERS.length - 1) {
      setSelectedCharacterIndex(selectedCharacterIndex + 1);
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
        }
      },
    );
  };

  return (
    <AuthorizedRoute>
      <div className="min-h-screen flex bg-icanBlue-200">
        <div className="hidden desktop:flex flex-1 flex-col justify-center px-8">
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

        <div className="hidden desktop:flex w-[600px] bg-white items-center justify-center">
          <PetDetailPanel
            character={selectedCharacter}
            onSelect={handleSelectPet}
            isLoading={createPetMutation.isPending}
          />
        </div>

        <div className="desktop:hidden w-full min-h-screen bg-icanBlue-200 flex flex-col px-4 pt-4 pb-6">
          <div className="[&>a]:w-16 [&>a]:h-16 [&>a>button]:w-full [&>a>button]:h-full">
            <BackButton onClick={() => router.back()} />
          </div>
          <div className="w-full max-w-md mx-auto">
            <h1 className="text-white font-quantico font-bold mobile:text-4xl desktop:text-6xl mb-2 text-left">
              Select a Character
            </h1>

            <p className="text-white font-quantico mobile:text-base desktop:text-lg mb-4 text-left px-0 pb-2">
              Swipe/click the arrow to view different characters and select your
              favorite!
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-start min-h-0 pt-0 pb-0">
            <div className="w-full max-w-md bg-icanBlue-100 rounded-lg p-6 flex flex-col items-center justify-between gap-2 h-full min-h-[50vh] max-h-[65vh]">
              <h2 className="text-white font-quantico font-bold mobile:text-4xl desktop:text-5xl text-center mt-4">
                {selectedCharacter.name}
              </h2>

              <p className="text-white font-quantico mobile:text-xl desktop:text-2xl text-center px-4 flex-shrink-0 mb-2">
                {selectedCharacter.description}
              </p>

              <div className="relative w-full flex items-center justify-center flex-1 min-h-[250px] mb-2">
                {selectedCharacterIndex > 0 && (
                  <NavigationArrow
                    direction="left"
                    onClick={handlePrevious}
                    ariaLabel="Previous character"
                  />
                )}

                <div className="flex items-center justify-center flex-1 px-24">
                  <Image
                    src={selectedCharacter.image}
                    alt={selectedCharacter.name}
                    width={280}
                    height={280}
                    className="mobile:w-[260px] mobile:h-[260px] desktop:w-[280px] desktop:h-[280px] object-contain"
                  />
                </div>

                {selectedCharacterIndex < PET_CHARACTERS.length - 1 && (
                  <NavigationArrow
                    direction="right"
                    onClick={handleNext}
                    ariaLabel="Next character"
                  />
                )}
              </div>

              <button
                onClick={handleSelectPet}
                disabled={createPetMutation.isPending}
                className={cn(
                  "w-full py-4 text-black font-quantico font-bold mobile:text-xl desktop:text-2xl transition-all duration-200 mb-0 mt-2",
                  "bg-loginGreen",
                  createPetMutation.isPending
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:opacity-90 active:scale-95",
                )}
                style={{ borderRadius: "0" }}
              >
                {createPetMutation.isPending ? "Creating..." : "Select"}
              </button>
            </div>
          </div>
        </div>
      </div>
      {createPetMutation.error && (
        <div className="fixed bottom-4 left-1/2 z-50 transform -translate-x-1/2 bg-red-500 text-white px-6 py-3 rounded-lg mobile:text-sm desktop:text-base">
          Unable to create your pet companion. Please try selecting again.
        </div>
      )}
    </AuthorizedRoute>
  );
}

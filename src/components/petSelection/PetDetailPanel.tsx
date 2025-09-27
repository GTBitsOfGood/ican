import Image from "next/image";
import { PetCharacter } from "@/lib/petCharacters";

interface PetDetailPanelProps {
  character: PetCharacter | null;
  onSelect: () => void;
  isCreating: boolean;
}

export default function PetDetailPanel({
  character,
  onSelect,
  isCreating,
}: PetDetailPanelProps) {
  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white text-center">
        <p className="text-lg mb-4">Select a character to see details</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center text-black max-w-md">
      {/* Character Name */}
      <h2
        className="text-5xl font-bold mb-3 font-pixelify"
        style={{ color: "#4C539B" }}
      >
        {character.name}
      </h2>

      {/* Name Change Note */}
      <p className="text-base text-gray-600 mb-8">*This name can be changed.</p>

      {/* Character Description */}
      <p className="text-lg mb-10 leading-relaxed max-w-md text-black">
        {character.description}
      </p>

      {/* Large Character Image */}
      <div className="mb-10">
        <Image
          src={character.image}
          alt={character.name}
          width={220}
          height={220}
          className="pixelated"
        />
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        disabled={isCreating}
        className={`
          px-16 py-5 text-white font-bold rounded-lg text-xl font-pixelify
          transition-all duration-200 min-w-[180px] shadow-lg
          ${
            isCreating
              ? "opacity-50 cursor-not-allowed"
              : "hover:shadow-xl active:scale-95"
          }
        `}
        style={{
          backgroundColor: "#4C539B",
          ...(isCreating
            ? {}
            : {
                ":hover": {
                  backgroundColor: "#3a4075",
                },
              }),
        }}
      >
        {isCreating ? "Creating..." : "Select"}
      </button>
    </div>
  );
}

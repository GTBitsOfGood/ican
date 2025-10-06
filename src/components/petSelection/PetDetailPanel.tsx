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
    <div className="flex flex-col items-center text-center text-black w-full px-12 py-16">
      {/* Character Name */}
      <h2
        className="text-6xl font-bold mb-4 font-quantico"
        style={{ color: "#4C539B" }}
      >
        {character.name}
      </h2>

      {/* Name Change Note */}
      <p className="text-base text-gray-600 mb-10 font-quantico">
        *This name can be changed.
      </p>

      {/* Character Description */}
      <p
        className="text-xl font-bold mb-12 leading-relaxed font-quantico px-12 max-w-md"
        style={{ color: "#4C539B" }}
      >
        {character.description}
      </p>

      {/* Large Character Image */}
      <div className="mb-12">
        <Image
          src={character.image}
          alt={character.name}
          width={240}
          height={240}
          className="pixelated"
        />
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        disabled={isCreating}
        className={`
          px-16 py-4 text-white font-bold text-2xl font-quantico
          transition-all duration-200 min-w-[180px]
          ${
            isCreating
              ? "opacity-50 cursor-not-allowed"
              : "hover:opacity-90 active:scale-95"
          }
        `}
        style={{
          backgroundColor: "#4C539B",
        }}
      >
        {isCreating ? "Creating..." : "Select"}
      </button>
    </div>
  );
}

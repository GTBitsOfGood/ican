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
    <div className="flex flex-col items-center text-center text-white">
      {/* Character Name */}
      <h2 className="text-4xl font-bold mb-2 font-pixelify text-white">
        {character.name}
      </h2>

      {/* Name Change Note */}
      <p className="text-sm text-white/70 mb-4">*This name can be changed.</p>

      {/* Character Description */}
      <p className="text-base mb-6 leading-relaxed max-w-xs">
        {character.description}
      </p>

      {/* Large Character Image */}
      <div className="mb-8">
        <Image
          src={character.image}
          alt={character.name}
          width={150}
          height={150}
          className="pixelated"
        />
      </div>

      {/* Select Button */}
      <button
        onClick={onSelect}
        disabled={isCreating}
        className={`
          px-8 py-3 bg-[#2c3694] text-white font-bold rounded-lg text-lg
          transition-all duration-200 min-w-[120px]
          ${
            isCreating
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#1e2463] active:scale-95"
          }
        `}
      >
        {isCreating ? "Creating..." : "Select"}
      </button>
    </div>
  );
}

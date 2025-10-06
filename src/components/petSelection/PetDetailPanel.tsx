import Image from "next/image";
import { PetCharacter } from "@/lib/petCharacters";
import { cn } from "@/lib/utils";

interface PetDetailPanelProps {
  character: PetCharacter | null;
  onSelect: () => void;
  isLoading: boolean;
}

export default function PetDetailPanel({
  character,
  onSelect,
  isLoading,
}: PetDetailPanelProps) {
  if (!character) {
    throw new Error("Character should never be null in PetDetailPanel");
  }

  return (
    <div className="flex flex-col items-center text-center text-black w-full px-12 py-16">
      <h2 className="text-6xl font-bold mb-4 font-quantico text-icanBlue-200">
        {character.name}
      </h2>

      <p className="text-base text-gray-600 mb-10 font-quantico">
        *This name can be changed.
      </p>

      <p className="text-xl font-bold mb-12 leading-relaxed font-quantico px-12 max-w-md text-icanBlue-200">
        {character.description}
      </p>

      <div className="mb-12">
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

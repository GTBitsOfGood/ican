import Image from "next/image";
import { PetCharacter } from "@/lib/petCharacters";

interface PetCharacterCardProps {
  character: PetCharacter;
  isSelected: boolean;
  onClick: () => void;
}

export default function PetCharacterCard({
  character,
  isSelected,
  onClick,
}: PetCharacterCardProps) {
  return (
    <div
      className={`
          cursor-pointer border-4 rounded-xl p-12 transition-all duration-200 w-80 h-80
          flex items-center justify-center
          ${
            isSelected
              ? "border-white bg-white/30 shadow-2xl scale-105"
              : "border-white/80 hover:border-white hover:bg-white/15 hover:scale-102"
          }
        `}
      onClick={onClick}
    >
      <Image
        src={character.image}
        alt={character.name}
        width={200}
        height={200}
        className="pixelated"
      />
    </div>
  );
}

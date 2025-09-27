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
        cursor-pointer border-4 rounded-xl p-8 transition-all duration-200 w-32 h-32
        flex items-center justify-center
        ${
          isSelected
            ? "border-white bg-white/30 shadow-2xl scale-105"
            : "border-white/60 hover:border-white hover:bg-white/15 hover:scale-102"
        }
      `}
      onClick={onClick}
    >
      <Image
        src={character.image}
        alt={character.name}
        width={96}
        height={96}
        className="pixelated"
      />
    </div>
  );
}

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
        cursor-pointer border-2 rounded-lg p-4 transition-all duration-200
        ${
          isSelected
            ? "border-white bg-white/20 shadow-lg"
            : "border-white/50 hover:border-white hover:bg-white/10"
        }
      `}
      onClick={onClick}
    >
      <div className="flex justify-center items-center h-20 w-20 mx-auto">
        <Image
          src={character.image}
          alt={character.name}
          width={80}
          height={80}
          className="pixelated"
        />
      </div>
    </div>
  );
}

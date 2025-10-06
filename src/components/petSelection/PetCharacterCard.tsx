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

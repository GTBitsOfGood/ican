import { PetCharacter } from "@/lib/petCharacters";
import PetCharacterCard from "./PetCharacterCard";

interface PetGridProps {
  characters: PetCharacter[];
  onCharacterSelect: (character: PetCharacter) => void;
}

export default function PetGrid({
  characters,
  onCharacterSelect,
}: PetGridProps) {
  return (
    <div className="grid grid-cols-2 gap-8">
      {characters.map((character) => (
        <PetCharacterCard
          key={character.type}
          character={character}
          isSelected={false}
          onClick={() => onCharacterSelect(character)}
        />
      ))}
    </div>
  );
}

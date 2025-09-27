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
    <div className="grid grid-cols-2 gap-6">
      {characters.map((character) => (
        <PetCharacterCard
          key={character.type}
          character={character}
          isSelected={false} // No pets in grid are selected (selected pet is shown on right)
          onClick={() => onCharacterSelect(character)}
        />
      ))}
    </div>
  );
}

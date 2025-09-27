import { PetCharacter } from "@/lib/petCharacters";
import PetCharacterCard from "./PetCharacterCard";

interface PetGridProps {
  characters: PetCharacter[];
  selectedCharacter: PetCharacter | null;
  onCharacterSelect: (character: PetCharacter) => void;
}

export default function PetGrid({
  characters,
  selectedCharacter,
  onCharacterSelect,
}: PetGridProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {characters.map((character) => (
        <PetCharacterCard
          key={character.type}
          character={character}
          isSelected={selectedCharacter?.type === character.type}
          onClick={() => onCharacterSelect(character)}
        />
      ))}
    </div>
  );
}

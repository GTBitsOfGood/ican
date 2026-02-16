import { PetEmotion, PetType } from "@/types/pet";
import Image from "next/image";
import { getCharacterImage } from "@/types/characters";
import { InventoryItem, ItemType } from "@/types/inventory";
import ClothingItem from "./appearance/clothingItem";
import storeItems from "@/lib/storeItems";
import BackgroundItem from "./appearance/backgroundItem";
import ShoeItem from "./appearance/shoeItem";
import HatItem from "./appearance/hatItem";
import OccupationalItem from "./appearance/occupationItem";
import { Appearance } from "@/db/models/pet";

interface PetAppearanceProps {
  petType?: PetType;
  emotion?: PetEmotion;
  selectedItem: InventoryItem | null;
  appearance: Appearance;
  className: string;
  outfitOnly?: boolean;
  showBackground?: boolean;
  onDragOver?: (e: React.DragEvent<HTMLImageElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLImageElement>) => void;
  characterImageSize?: number;
}

const PetAppearance: React.FC<PetAppearanceProps> = ({
  petType,
  emotion = PetEmotion.NEUTRAL,
  selectedItem,
  appearance,
  className,
  outfitOnly = false,
  showBackground = true,
  onDragOver,
  onDrop,
  characterImageSize,
}) => {
  const equippedBackground =
    appearance?.background && storeItems.background[appearance.background]
      ? storeItems.background[appearance.background]
      : undefined;

  return (
    <div
      className={`relative ${className} flex items-center justify-center w-full`}
    >
      {!outfitOnly && petType && (
        <Image
          src={getCharacterImage(petType, emotion)}
          alt={`${petType}`}
          width={characterImageSize || 275}
          height={characterImageSize || 275}
          draggable="false"
          onDragOver={onDragOver}
          onDrop={onDrop}
          className="object-contain pointer-events-none select-none relative z-10 max-w-full max-h-full"
        />
      )}
      {selectedItem?.type === ItemType.CLOTHING ? (
        <ClothingItem selectedItem={selectedItem} />
      ) : (
        appearance?.clothing && (
          <ClothingItem
            selectedItem={storeItems.clothing[appearance.clothing]}
          />
        )
      )}
      {selectedItem?.type === ItemType.HAT ? (
        <HatItem selectedItem={selectedItem} />
      ) : (
        appearance?.hat && (
          <HatItem selectedItem={storeItems.hat[appearance.hat]} />
        )
      )}
      {selectedItem?.type === ItemType.OCCUPATION ? (
        <OccupationalItem selectedItem={selectedItem} />
      ) : (
        appearance?.occupation && (
          <OccupationalItem
            selectedItem={storeItems.occupation[appearance.occupation]}
          />
        )
      )}
      {showBackground &&
        (selectedItem?.type === ItemType.BACKGROUND ? (
          <BackgroundItem selectedItem={selectedItem} />
        ) : (
          equippedBackground && (
            <BackgroundItem selectedItem={equippedBackground} />
          )
        ))}
      {selectedItem?.type === ItemType.SHOES ? (
        <ShoeItem selectedItem={selectedItem} />
      ) : (
        appearance?.shoes && (
          <ShoeItem selectedItem={storeItems.shoes[appearance.shoes]} />
        )
      )}
    </div>
  );
};

export default PetAppearance;

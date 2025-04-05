import { PetType } from "@/types/pet";
import Image from "next/image";
import { characterImages } from "@/types/characters";
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
  selectedItem: InventoryItem | null;
  appearance: Appearance;
  className: string;
  outfitOnly?: boolean;
}

const PetAppearance: React.FC<PetAppearanceProps> = ({
  petType,
  selectedItem,
  appearance,
  className,
  outfitOnly = false,
}) => {
  return (
    <div className={`${className} flex items-center justify-center w-full`}>
      {!outfitOnly && petType && (
        <Image
          src={characterImages[petType]}
          alt={`${petType}`}
          width={characterImages[petType].width}
          height={characterImages[petType].height}
          draggable="false"
          className="object-contain pointer-events-none select-none relative z-10"
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
      {selectedItem?.type === ItemType.BACKGROUND ? (
        <BackgroundItem selectedItem={selectedItem} />
      ) : (
        appearance?.background && (
          <BackgroundItem
            selectedItem={storeItems.background[appearance.background]}
          />
        )
      )}
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

import { Pet, PetType } from "@/types/pet";
import Image from "next/image";
import { characterImages } from "@/types/characters";
import { AccessoryCategory, InventoryItem, ItemType } from "@/types/inventory";
import ClothingItem from "./appearance/clothingItem";
import storeItems from "@/lib/storeItems";
import FoodItem from "./appearance/foodItem";
import BackgroundItem from "./appearance/backgroundItem";
import ShoeItem from "./appearance/shoeItem";
import HatItem from "./appearance/hatItem";
import OccupationalItem from "./appearance/occupationItem";

interface PetAppearanceProps {
  petType: PetType;
  selectedItem: InventoryItem | null;
  petData: Pet;
  className: string;
}

const PetAppearance: React.FC<PetAppearanceProps> = ({
  petType,
  selectedItem,
  petData,
  className,
}) => {
  return (
    <div
      className={`${className} relative flex items-center justify-center w-full`}
    >
      <Image
        src={characterImages[petType]}
        alt={`${petType}`}
        width={characterImages[petType].width}
        height={characterImages[petType].height}
        draggable="false"
        className="object-contain pointer-events-none select-none relative z-10"
      />
      {selectedItem?.type === ItemType.CLOTHING ? (
        <ClothingItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.clothing && (
          <ClothingItem
            selectedItem={storeItems.clothing[petData.appearance.clothing]}
          />
        )
      )}
      {selectedItem?.type === ItemType.FOOD ? (
        <FoodItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.food && (
          <FoodItem selectedItem={storeItems.food[petData.appearance.food]} />
        )
      )}
      {selectedItem?.category === AccessoryCategory.HAT ? (
        <HatItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.accessory?.hat && (
          <HatItem
            selectedItem={
              storeItems.accessory[petData.appearance.accessory.hat]
            }
          />
        )
      )}
      {selectedItem?.category === AccessoryCategory.OCCUPATION ? (
        <OccupationalItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.accessory?.occupation && (
          <OccupationalItem
            selectedItem={
              storeItems.accessory[petData.appearance.accessory.occupation]
            }
          />
        )
      )}
      {selectedItem?.type === ItemType.BACKGROUND ? (
        <BackgroundItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.background && (
          <BackgroundItem
            selectedItem={storeItems.background[petData.appearance.background]}
          />
        )
      )}
      {selectedItem?.category === AccessoryCategory.SHOES ? (
        <ShoeItem selectedItem={selectedItem} />
      ) : (
        petData?.appearance?.accessory?.shoes && (
          <ShoeItem
            selectedItem={
              storeItems.accessory[petData.appearance.accessory.shoes]
            }
          />
        )
      )}
    </div>
  );
};

export default PetAppearance;

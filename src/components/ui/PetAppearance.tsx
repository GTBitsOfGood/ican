import { PetType } from "@/types/pet";
import { StoreItem } from "./InventoryTabContent";
import Image from "next/image";
import { characterImages } from "@/types/characters";
import { AccessoryType, ItemType } from "@/types/store";

interface PetAppearanceProps {
  petType: PetType;
  selectedItems: StoreItem[];
}

const PetAppearance: React.FC<PetAppearanceProps> = ({
  petType,
  selectedItems,
}) => {
  return (
    <div className="flex items-center justify-center w-full">
      {/* Pet image */}
      <Image
        src={`/characters/${petType}.svg`}
        alt={`${petType}`}
        width={characterImages[petType].width}
        height={characterImages[petType].height}
        draggable="false"
        className="object-contain pointer-events-none select-none relative z-10"
      />

      {/* Selected item image */}
      {selectedItems.filter((item) => item != null).length > 0 && (
        <>
          {selectedItems.map((item, index) => {
            if (item.type === ItemType.CLOTHES) {
              return (
                <div
                  key={`clothes-${index}`}
                  className="absolute translate-x-[4%] translate-y-[82%] flex items-center justify-center z-20"
                >
                  <img
                    src={item.image}
                    alt={item.name || "Clothing Item"}
                    width={145}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === AccessoryType.SHOES) {
              return (
                <div
                  key={`shoes-${index}`}
                  className="absolute translate-x-[4%] translate-y-[120px] flex items-center justify-center z-20"
                >
                  <img
                    src={item.image}
                    alt={item.name || "Shoes Item"}
                    width={140}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === AccessoryType.HAT) {
              return (
                <div
                  key={`hat-${index}`}
                  className="absolute translate-x-[4%] -translate-y-[100px] flex items-center justify-center z-20"
                >
                  <img
                    src={item.image}
                    alt={item.name || "Hat Item"}
                    width={200}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === ItemType.FOOD) {
              return (
                <div
                  key={`food-${index}`}
                  className="absolute translate-x-[150%] translate-y-[65%] w-[5%] flex items-center justify-center z-20"
                >
                  <img
                    src={item.image}
                    alt={item.name || "Food Item"}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            }
            return null;
          })}
        </>
      )}
    </div>
  );
};

export default PetAppearance;

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
      <Image
        src={`/characters/${petType}.svg`}
        alt={`${petType}`}
        width={characterImages[petType].width}
        height={characterImages[petType].height}
        draggable="false"
        className="object-contain pointer-events-none select-none relative z-10"
      />

      {selectedItems.filter((item) => item != null).length > 0 && (
        <>
          {selectedItems.map((item, index) => {
            if (item.type === ItemType.CLOTHES) {
              return (
                <div
                  key={`clothes-${index}`}
                  className="absolute w-[60%] translate-x-[4%] translate-y-[78%] flex items-center justify-center z-20"
                >
                  <Image
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
                  className="absolute w-[57%] desktop:translate-x-[4%] tablet:translate-x-[2%] translate-y-[450%] flex items-center justify-center z-20"
                >
                  <Image
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
                  className="absolute w-[75%] translate-x-[4%] -translate-y-[87%] flex items-center justify-center z-20"
                >
                  <Image
                    src={item.image}
                    alt={item.name || "Hat Item"}
                    width={190}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === AccessoryType.OCCUPATION) {
              return (
                <div
                  key={`hat-${index}`}
                  className="absolute w-[43%] translate-x-[80%] translate-y-[70%] flex items-center justify-center z-30"
                >
                  <Image
                    src={item.image}
                    alt={item.name || "Occupation Item"}
                    width={110}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === ItemType.FOOD) {
              return (
                <div
                  key={`food-${index}`}
                  className="absolute w-[30%] translate-x-[160%] translate-y-[58%] flex items-center justify-center z-20"
                >
                  <Image
                    src={item.image}
                    alt={item.name || "Food Item"}
                    width={90}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                  />
                </div>
              );
            } else if (item.type === ItemType.BACKGROUND) {
              return (
                <div
                  key={`food-${index}`}
                  className="absolute largeDesktop:w-[390px] desktop:w-[300px] tablet:w-[250px] flex items-center justify-center z-0"
                >
                  <Image
                    src={item.image}
                    alt={item.name || "Food Item"}
                    width={413}
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

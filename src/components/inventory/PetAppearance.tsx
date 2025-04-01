import { PetType } from "@/types/pet";
import Image from "next/image";
import { characterImages } from "@/types/characters";
import { AccessoryCategory, InventoryItem, ItemType } from "@/types/inventory";

interface PetAppearanceProps {
  petType: PetType;
  selectedItem: InventoryItem | null;
}

const PetAppearance: React.FC<PetAppearanceProps> = ({
  petType,
  selectedItem,
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
      {selectedItem && (
        <>
          {selectedItem.type === ItemType.CLOTHING && (
            <div className="absolute w-[60%] translate-x-[4%] translate-y-[78%] flex items-center justify-center z-20">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name || "Clothing Item"}
                width={145}
                draggable="false"
                className="object-contain pointer-events-none select-none"
                height={0}
                sizes="100vw"
              />
            </div>
          )}
          {selectedItem.type === ItemType.FOOD && (
            <div className="absolute w-[30%] translate-x-[160%] translate-y-[58%] flex items-center justify-center z-20">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name || "Food Item"}
                width={90}
                draggable="false"
                className="object-contain pointer-events-none select-none"
                height={0}
                sizes="100vw"
              />
            </div>
          )}
          {selectedItem.type === ItemType.BACKGROUND && (
            <div className="absolute largeDesktop:w-[390px] desktop:w-[300px] tablet:w-[250px] flex items-center justify-center z-0">
              <Image
                src={selectedItem.image}
                alt={selectedItem.name || "Background Item"}
                width={413}
                draggable="false"
                className="object-contain pointer-events-none select-none"
                height={0}
                sizes="100vw"
              />
            </div>
          )}
          {selectedItem.type === ItemType.ACCESSORY && (
            <>
              {selectedItem.category === AccessoryCategory.SHOES && (
                <div className="absolute w-[57%] desktop:translate-x-[4%] tablet:translate-x-[2%] translate-y-[450%] flex items-center justify-center z-20">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name || "Shoes Item"}
                    width={140}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                    height={0}
                    sizes="100vw"
                  />
                </div>
              )}
              {selectedItem.category === AccessoryCategory.HAT && (
                <div className="absolute w-[75%] translate-x-[4%] -translate-y-[87%] flex items-center justify-center z-20">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name || "Hat Item"}
                    width={190}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                    height={0}
                    sizes="100vw"
                  />
                </div>
              )}
              {selectedItem.category === AccessoryCategory.OCCUPATION && (
                <div className="absolute w-[43%] translate-x-[80%] translate-y-[70%] flex items-center justify-center z-30">
                  <Image
                    src={selectedItem.image}
                    alt={selectedItem.name || "Occupation Item"}
                    width={110}
                    draggable="false"
                    className="object-contain pointer-events-none select-none"
                    height={0}
                    sizes="100vw"
                  />
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default PetAppearance;

import React, { Dispatch, SetStateAction } from "react";
import { SavedOutfit } from "@/db/models/pet";
import PetAppearance from "./PetAppearance";

interface ItemProps {
  item: SavedOutfit;
  isSelected: boolean;
  setSelectedItem: Dispatch<SetStateAction<SavedOutfit | null>>;
  isWearing: boolean;
}

const Outfit: React.FC<ItemProps> = ({
  item,
  isSelected,
  setSelectedItem,
  isWearing,
}) => {
  return (
    <div
      className={`p-4 cursor-pointer mx-auto flex flex-col items-center w-full ${
        isSelected
          ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
          : "border-[5px] border-transparent hover:bg-icanGreen-200/25 hover:border-black/25"
      }`}
      onClick={() => setSelectedItem(item)}
    >
      {isWearing && (
        <div className="flex justify-center bg-icanGreen-100 px-2 mx-auto mb-[30px] text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold font-quantico">
          Wearing
        </div>
      )}
      <div className="relative largeDesktop:w-[121px] largeDesktop:h-[121px] desktop:w-[105px] desktop:h-[105px] tablet:w-[90px] tablet:h-[90px] object-contain">
        <PetAppearance
          appearance={item as Omit<SavedOutfit, "name">}
          className=""
          selectedItem={null}
          outfitOnly={true}
        />
      </div>
      <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
        {item.name}
      </div>
    </div>
  );
};

export default Outfit;

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
      className={`relative mx-auto flex w-full cursor-pointer flex-col items-center overflow-hidden p-3 desktop:p-4 ${
        isSelected
          ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
          : "border-[5px] border-transparent hover:bg-icanGreen-200/25 hover:border-black/25"
      }`}
      onClick={() => setSelectedItem(item)}
    >
      {isWearing && (
        <div className="absolute -right-[65px] top-8 rotate-45 flex justify-center bg-icanGreen-100 px-14 mx-auto mb-[30px] text-center text-black largeDesktop:text-3xl desktop:text-[30px] tablet:text-[24px] font-bold font-quantico z-[25]">
          Wearing
        </div>
      )}
      <div className="relative h-[72px] w-[72px] object-contain tablet:h-[90px] tablet:w-[90px] desktop:h-[105px] desktop:w-[105px] largeDesktop:h-[121px] largeDesktop:w-[121px]">
        <PetAppearance
          appearance={item as Omit<SavedOutfit, "name">}
          className=""
          selectedItem={null}
          outfitOnly={true}
        />
      </div>
      <div className="mt-[10px] font-quantico text-center text-[20px] font-bold leading-none text-black tablet:text-[24px] desktop:text-[30px] largeDesktop:text-[36px]">
        {item.name}
      </div>
    </div>
  );
};

export default Outfit;

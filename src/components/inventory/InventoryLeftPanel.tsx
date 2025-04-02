import React from "react";
import PetAppearance from "./PetAppearance";
import { InventoryItem } from "@/types/inventory";
import { Pet, PetType } from "@/types/pet";

interface PanelProps {
  petData: Pet;
  selectedItem: InventoryItem | null;
  button: React.ReactNode;
}

const InventoryLeftPanel: React.FC<PanelProps> = ({
  petData,
  selectedItem,
  button,
}) => {
  return (
    <div className="relative h-screen p-4 bg-[#E6E8F9]">
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-icanBlue-300 font-quantico leading-none w-full">
        <div className="font-bold short:text-[40px] minimized:text-[35px] tiny:text-[30px] largeDesktop:text-[64px] desktop:text-[52px] tablet:text-[40px]">
          {selectedItem ? selectedItem.displayName : "Select Item"}
        </div>
        <div className="short:text-[24px] minimized:text-[22px] tiny:text-[20px] largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px]">
          {selectedItem
            ? selectedItem.description
            : "Click item to learn more!"}
        </div>
      </div>

      <div className="short:w-[150px] minimized:w-[135px] tiny:w-[120px] largeDesktop:w-[212px] desktop:w-[180px] tablet:w-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <PetAppearance
          petData={petData}
          petType={petData.petType as PetType}
          selectedItem={selectedItem}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        {button}
      </div>
    </div>
  );
};

export default InventoryLeftPanel;

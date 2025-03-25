import React from "react";
import { StoreItem } from "./InventoryTabContent";
import { Pet } from "@/types/pet";
import PetAppearance from "./PetAppearance";

interface PanelProps {
  petData: Pet;
  selectedItem: StoreItem | null;
  button: React.ReactNode;
}

const InventoryLeftPanel: React.FC<PanelProps> = ({
  petData,
  selectedItem,
  button,
}) => {
  return (
    <div className="relative h-screen p-4 bg-[#E6E8F9]">
      {/* Top Description */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 text-center text-icanBlue-300 font-quantico leading-none w-full">
        <div className="font-bold largeDesktop:text-[64px] desktop:text-[52px] tablet:text-[40px]">
          {selectedItem ? selectedItem.displayName : "Select Item"}
        </div>
        <div className="largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px]">
          {selectedItem
            ? selectedItem.description
            : "Click item to learn more!"}
        </div>
      </div>

      {/* Pet Appearance (Centered) */}
      <div className="largeDesktop:w-[212px] desktop:w-[180px] tablet:w-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <PetAppearance
          petType={petData.petType}
          selectedItems={[selectedItem as StoreItem]}
        />
      </div>

      {/* Bottom Button */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
        {button}
      </div>
    </div>
  );
};

export default InventoryLeftPanel;

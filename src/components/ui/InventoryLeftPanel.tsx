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
    <div className="flex flex-col h-screen p-4 bg-[#E6E8F9]">
      <div className="text-center text-icanBlue-300 font-quantico leading-none">
        <div className="font-bold largeDesktop:text-[64px] desktop:text-[52px] tablet:text-[40px]">
          {selectedItem ? selectedItem.displayName : "Select Item"}
        </div>
        <div className="largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px]">
          {selectedItem
            ? selectedItem.description
            : "Click item to learn more!"}
        </div>
      </div>
      <div className={`flex-1 flex flex-col justify-center items-center`}>
        <div
          className={
            "largeDesktop:max-w-[250px] desktop:max-w-[200px] tablet:max-w-[150px]"
          }
        >
          <PetAppearance
            petType={petData.petType}
            selectedItems={[selectedItem as StoreItem]}
          />
        </div>
      </div>
      <div className="mx-auto">{button}</div>
    </div>
  );
};

export default InventoryLeftPanel;

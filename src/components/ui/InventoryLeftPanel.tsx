import React from "react";
import { StoreItem } from "./InventoryTabContent";
import { Pet } from "@/types/pet";
import PetAppearance from "./PetAppearance";
import { ItemType } from "@/types/store";

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
        <div className="font-bold desktop:text-[64px] tablet:text-[40px]">
          {selectedItem ? selectedItem.displayName : "Select Item"}
        </div>
        <div className="desktop:text-4xl tablet:text-[24px]">
          {selectedItem
            ? selectedItem.description
            : "Click item to learn more!"}
        </div>
      </div>
      <div
        className={`flex-1 flex flex-col justify-center items-center ${selectedItem?.type == ItemType.BACKGROUND ? "bg-[]" : ""}`}
      >
        <div className={"desktop:max-w-[250px] tablet:max-w-[150px]"}>
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

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
      <div className="text-[64px] text-center font-bold text-icanBlue-300 font-quantico leading-none">
        {selectedItem ? selectedItem.displayName : "Select Item"}
      </div>
      <div className="text-4xl text-center text-icanBlue-300 font-quantico">
        {selectedItem ? selectedItem.description : "Click item to learn more!"}
      </div>
      <div className={"flex-1 flex max-w-[250px] mx-auto"}>
        <PetAppearance
          petType={petData.petType}
          selectedItems={[selectedItem as StoreItem]}
        />
      </div>
      <div className="mx-auto">{button}</div>
    </div>
  );
};

export default InventoryLeftPanel;

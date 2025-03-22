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
      <div className="largeDesktop:w-[250px] desktop:w-[200px] tablet:w-[150px] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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

    // <div className="flex flex-col h-screen p-4 bg-[#E6E8F9]">
    //   <div className="text-center text-icanBlue-300 font-quantico leading-none">
    //     <div className="font-bold largeDesktop:text-[64px] desktop:text-[52px] tablet:text-[40px]">
    //       {selectedItem ? selectedItem.displayName : "Select Item"}
    //     </div>
    //     <div className="largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px]">
    //       {selectedItem
    //         ? selectedItem.description
    //         : "Click item to learn more!"}
    //     </div>
    //   </div>
    //   <div className={`flex-1 flex flex-col justify-center items-center`}>
    //     <div
    //       className={
    //         "largeDesktop:max-w-[250px] desktop:max-w-[200px] tablet:max-w-[150px]"
    //       }
    //     >
    //       <PetAppearance
    //         petType={petData.petType}
    //         selectedItems={[selectedItem as StoreItem]}
    //       />
    //     </div>
    //   </div>
    //   <div className="mx-auto">{button}</div>
    // </div>
  );
};

export default InventoryLeftPanel;

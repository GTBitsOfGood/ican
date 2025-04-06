import React from "react";
import PetAppearance from "./PetAppearance";
import { InventoryItem } from "@/types/inventory";
import { Pet, PetType } from "@/types/pet";
import { SavedOutfit } from "@/db/models/pet";
import { useRouter } from "next/router";

interface PanelProps {
  petData: Pet;
  selectedItem: InventoryItem | SavedOutfit | null;
  button: React.ReactNode;
  topView?: React.ReactNode;
}

const InventoryLeftPanel: React.FC<PanelProps> = ({
  petData,
  selectedItem,
  button,
  topView,
}) => {
  const isSavedOutfit = selectedItem && "clothing" in selectedItem;
  const router = useRouter();

  return (
    <div className="relative desktop:h-screen p-4 bg-[#E6E8F9]">
      <div className="-mt-4 mb-12 w-full desktop:hidden">
        <div
          className={`flex ${topView != undefined ? "justify-between" : "justify-end"} items-center`}
        >
          {topView}
          <div
            className="font-pixelify mt-[30px] pr-[30px] text-icanBlue-300 text-7xl leading-none cursor-pointer"
            onClick={() => router.push("/")}
          >
            x
          </div>
        </div>
      </div>
      <div className="desktop:absolute top-4 desktop:left-1/2 desktop:-translate-x-1/2 text-center text-icanBlue-300 font-quantico leading-none w-full">
        <div className="font-bold short:text-[40px] minimized:text-[35px] largeDesktop:text-[64px] desktop:text-[52px] text-[40px]">
          {selectedItem
            ? isSavedOutfit
              ? selectedItem.name
              : (selectedItem as InventoryItem).displayName
            : "Select Item"}
        </div>
        {!isSavedOutfit && (
          <div className="short:text-[24px] minimized:text-[22px] largeDesktop:text-[36px] desktop:text-[30px] text-[24px]">
            {selectedItem
              ? (selectedItem as InventoryItem).description
              : "Click item to learn more!"}
          </div>
        )}
      </div>

      <div className="my-12 desktop:mt-0 mx-auto desktop:block relative short:w-[150px] minimized:w-[135px] largeDesktop:w-[212px] desktop:w-[180px] w-[150px] desktop:absolute desktop:top-1/2 desktop:left-1/2 desktop:-translate-x-1/2 desktop:-translate-y-1/2">
        <PetAppearance
          appearance={
            isSavedOutfit ? (selectedItem as SavedOutfit) : petData.appearance
          }
          petType={petData.petType as PetType}
          selectedItem={isSavedOutfit ? null : (selectedItem as InventoryItem)}
          className=""
        />
      </div>

      <div className="mb-6 desktop:mb-0 flex items-center justify-center desktop:block desktop:absolute desktop:bottom-4 desktop:left-1/2 desktop:-translate-x-1/2">
        {button || <div className="h-[100px]"></div>}
      </div>
    </div>
  );
};

export default InventoryLeftPanel;

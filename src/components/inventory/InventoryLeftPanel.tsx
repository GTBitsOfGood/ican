import React from "react";
import PetAppearance from "./PetAppearance";
import { InventoryItem } from "@/types/inventory";
import { Pet, PetType } from "@/types/pet";
import { SavedOutfit } from "@/db/models/pet";
import { useRouter } from "next/router";
import BackButton from "../ui/BackButton";

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
    <div className="relative bg-[#E6E8F9] p-4 desktop:h-screen">
      <div className="-mt-4 mb-12 w-full desktop:hidden">
        <div className="flex justify-between items-center">
          {topView}
          <div className="mt-[30px] h-20 w-20 pr-[30px]">
            <BackButton onClick={() => router.push("/")} />
          </div>
        </div>
      </div>
      <div className="w-full text-center font-quantico leading-none text-icanBlue-300 desktop:absolute desktop:left-1/2 desktop:top-4 desktop:-translate-x-1/2">
        <div className="text-[40px] font-bold short:text-[40px] minimized:text-[35px] desktop:text-[52px] largeDesktop:text-[64px]">
          {selectedItem
            ? isSavedOutfit
              ? selectedItem.name
              : (selectedItem as InventoryItem).displayName
            : "Select Item"}
        </div>
        {!isSavedOutfit && (
          <div className="text-[24px] short:text-[24px] minimized:text-[22px] desktop:text-[30px] largeDesktop:text-[36px]">
            {selectedItem
              ? (selectedItem as InventoryItem).description
              : "Click item to learn more!"}
          </div>
        )}
      </div>

      <div className="relative mx-auto my-12 w-[150px] short:w-[150px] minimized:w-[135px] desktop:absolute desktop:left-1/2 desktop:top-1/2 desktop:my-0 desktop:mt-0 desktop:w-[180px] desktop:-translate-x-1/2 desktop:-translate-y-1/2 largeDesktop:w-[212px]">
        <PetAppearance
          appearance={
            isSavedOutfit ? (selectedItem as SavedOutfit) : petData.appearance
          }
          petType={petData.petType as PetType}
          selectedItem={isSavedOutfit ? null : (selectedItem as InventoryItem)}
          className=""
          characterImageSize={180}
        />
      </div>

      <div className="mb-6 flex items-center justify-center desktop:absolute desktop:bottom-4 desktop:left-1/2 desktop:mb-0 desktop:block desktop:-translate-x-1/2">
        {button || <div className="h-[100px]"></div>}
      </div>
    </div>
  );
};

export default InventoryLeftPanel;

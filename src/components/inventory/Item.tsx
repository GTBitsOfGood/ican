import React, { Dispatch, SetStateAction } from "react";
import Image from "next/image";
import { InventoryItem } from "@/types/inventory";

interface ItemProps {
  type: "Store" | "Bag";
  item: InventoryItem;
  isSelected: boolean;
  setSelectedItem: Dispatch<SetStateAction<InventoryItem | null>>;
  isWearing: boolean;
}

const Item: React.FC<ItemProps> = ({
  type,
  item,
  isSelected,
  setSelectedItem,
  isWearing,
}) => {
  return (
    <div
      className={`relative p-4 cursor-pointer mx-auto flex flex-col items-center w-full overflow-hidden ${
        isSelected
          ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
          : "border-[5px] border-transparent hover:bg-icanGreen-200/25 hover:border-black/25"
      }`}
      onClick={() => {
        setSelectedItem(item);
      }}
    >
      {type === "Bag" && isWearing ? (
        <div className="absolute -right-[65px] top-8 rotate-45 flex justify-center bg-icanGreen-100 px-14 mx-auto mb-[30px] text-center text-black largeDesktop:text-3xl desktop:text-[30px] tablet:text-[24px] font-bold font-quantico">
          Wearing
        </div>
      ) : (
        type === "Store" && (
          <div className="flex justify-center bg-[#FFFFFF66] px-2 mx-auto mb-[30px] text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold font-quantico">
            <Image
              src="/icons/Coin.svg"
              alt="Coins"
              width={38}
              height={38}
              draggable={false}
              className="select-none object-contain"
            />
            <div className="pl-1">{item.cost}</div>
          </div>
        )
      )}
      <Image
        src={item.image}
        alt={item.name}
        draggable="false"
        className="largeDesktop:w-[121px] largeDesktop:h-[121px] desktop:w-[105px] desktop:h-[105px] tablet:w-[90px] tablet:h-[90px] object-contain"
        height={0}
        width={0}
        sizes="100vw"
      />
      <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
        {item.displayName}
      </div>
    </div>
  );
};

export default Item;

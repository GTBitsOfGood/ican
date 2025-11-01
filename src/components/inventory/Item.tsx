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
  const sportsOccupations = [
    "SOCCER_OCCUPATION",
    "BASKETBALL_OCCUPATION",
    "FOOTBALL_OCCUPATION",
    "BASEBALL_OCCUPATION",
    "TENNIS_OCCUPATION",
  ];
  const isSportsItem = sportsOccupations.includes(item.name);

  const imageSizeClass = isSportsItem
    ? "largeDesktop:w-[240px] largeDesktop:h-[240px] desktop:w-[220px] desktop:h-[220px] tablet:w-[200px] tablet:h-[200px]"
    : "largeDesktop:w-[121px] largeDesktop:h-[121px] desktop:w-[105px] desktop:h-[105px] tablet:w-[90px] tablet:h-[90px]";

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
      <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
        {item.displayName}
      </div>
      <div
        className={
          isSportsItem
            ? "overflow-hidden largeDesktop:h-[160px] desktop:h-[140px] tablet:h-[120px] flex items-center justify-center -mb-8"
            : ""
        }
      >
        <Image
          src={item.image}
          alt={item.name}
          draggable="false"
          className={`${imageSizeClass} object-contain ${isSportsItem ? "object-center" : ""}`}
          height={0}
          width={0}
          sizes="100vw"
        />
      </div>
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
    </div>
  );
};

export default Item;

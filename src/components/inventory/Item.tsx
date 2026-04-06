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
    ? "h-[110px] w-[110px] tablet:h-[160px] tablet:w-[160px] desktop:h-[220px] desktop:w-[220px] largeDesktop:h-[240px] largeDesktop:w-[240px]"
    : "h-[72px] w-[72px] tablet:h-[90px] tablet:w-[90px] desktop:h-[105px] desktop:w-[105px] largeDesktop:h-[121px] largeDesktop:w-[121px]";

  return (
    <div
      className={`relative mx-auto flex w-full cursor-pointer flex-col items-center overflow-hidden p-3 desktop:p-4 ${
        isSelected
          ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
          : "border-[5px] border-transparent hover:bg-icanGreen-200/25 hover:border-black/25"
      }`}
      onClick={() => {
        setSelectedItem(item);
      }}
    >
      <div className="mt-[10px] font-quantico text-center text-[20px] font-bold leading-none text-black tablet:text-[24px] desktop:text-[30px] largeDesktop:text-[36px]">
        {item.displayName}
      </div>
      <div
        className={
          isSportsItem
            ? "flex h-[88px] items-center justify-center overflow-hidden tablet:h-[120px] desktop:h-[140px] largeDesktop:h-[160px] -mb-4 desktop:-mb-8"
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
          <div className="mx-auto mb-2 flex justify-center bg-[#FFFFFF66] px-2 text-center font-quantico text-[20px] font-bold text-black tablet:mb-[18px] tablet:text-[24px] desktop:mb-[30px] desktop:text-[30px] largeDesktop:text-[36px]">
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

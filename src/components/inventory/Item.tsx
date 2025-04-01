import React from "react";
import Image from "next/image";
import { InventoryItem, ItemType } from "@/types/inventory";

interface ItemProps {
  item: InventoryItem;
  isSelected: boolean;
  onClick: () => void;
}

const Item: React.FC<ItemProps> = ({ item, isSelected, onClick }) => {
  return (
    <div
      className={`p-4 cursor-pointer mx-auto flex flex-col items-center largeDesktop:w-[200px] desktop:w-[180px] tablet:w-[160px] largeDesktop:h-[300px] desktop:h-[270px] tablet:h-[240px] ${
        isSelected
          ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
          : "border-[5px] border-transparent hover:bg-icanGreen-200/25 hover:border-black/25"
      }`}
      onClick={onClick}
    >
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
      <div
        className={`${
          item.type === ItemType.FOOD
            ? "largeDesktop:w-[130px] desktop:w-[100px] tablet:w-[70px]"
            : "largeDesktop:w-[154px] desktop:w/[120px] tablet:w-[100px]"
        }`}
      >
        <Image
          src={item.image}
          alt={item.name}
          draggable="false"
          className="w-[150px]"
          height={0}
          width={0}
          sizes="100vw"
        />
      </div>
      <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
        {item.displayName}
      </div>
    </div>
  );
};

export default Item;

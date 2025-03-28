import { AccessoryType, ItemType } from "@/types/store";
import Image from "next/image";
import React, { useEffect, useState } from "react";

export interface StoreItem {
  displayName: string;
  name: string;
  type: ItemType | AccessoryType;
  image: string;
  cost: number;
  level: number;
  description: string;
}

interface StoreTabContentProps {
  items: StoreItem[];
  petLevel: number;
  onSelectItem?: (item: StoreItem) => void;
}

const InventoryTabContent: React.FC<StoreTabContentProps> = ({
  items,
  petLevel,
  onSelectItem,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleItemClick = (index: number, item: StoreItem): void => {
    setSelectedIndex(index);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  useEffect(() => {
    setSelectedIndex(null);
  }, [items.length]);

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {items.map((item, index) =>
        petLevel >= item.level ? (
          <div
            key={index}
            className={`p-4 cursor-pointer mx-auto flex flex-col items-center largeDesktop:w-[200px] desktop:w-[180px] tablet:w-[160px] largeDesktop:h-[300px] desktop:h-[270px] tablet:h-[240px] ${
              selectedIndex === index
                ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
                : "border-[5px] border-transparent rounded-lg"
            }`}
            onClick={() => {
              handleItemClick(index, item);
            }}
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
              className={`${item.type == ItemType.FOOD ? "largeDesktop:w-[130px] desktop:w-[100px] tablet:w-[70px]" : "largeDesktop:w-[154px] desktop:w-[120px] tablet:w-[100px]"}`}
            >
              <img
                src={item.image}
                alt={item.name}
                draggable="false"
                className="w-[150px]"
              />
            </div>
            <div className="mt-[10px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
              {item.displayName}
            </div>
          </div>
        ) : (
          <div
            key={index}
            className={`p-4 mx-auto flex flex-col items-center mt-[60px]`}
          >
            <img
              src={"store/Lock.svg"}
              alt={item.name}
              className="largeDesktop:w-[121px] desktop:w-[105px] tablet:w-[90px]"
            />
            <div className="mt-[23px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
              {`Level ${item.level}`}
            </div>
          </div>
        ),
      )}
    </div>
  );
};

export default InventoryTabContent;

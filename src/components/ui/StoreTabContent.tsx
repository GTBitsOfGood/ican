import React, { useState } from "react";

interface StoreItem {
  displayName: string;
  name: string;
  image: string;
  cost: number;
  description: string;
}

interface StoreTabContentProps {
  items: StoreItem[];
  onSelectItem?: (item: StoreItem) => void;
}

const StoreTabContent: React.FC<StoreTabContentProps> = ({
  items,
  onSelectItem,
}) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const handleItemClick = (index: number, item: StoreItem): void => {
    setSelectedIndex(index);
    if (onSelectItem) {
      onSelectItem(item);
    }
  };

  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {items.map((item, index) => (
        <div
          key={index}
          className={`p-4 cursor-pointer mx-auto flex flex-col items-center w-[200px] h-[300px] ${
            selectedIndex === index
              ? "bg-icanGreen-200 border-[5px] border-black shadow-md"
              : "border-[5px] border-transparent rounded-lg"
          }`}
          onClick={() => handleItemClick(index, item)}
        >
          <div className="bg-[#FFFFFF66] w-[130px] h-[48px] mx-auto mb-[30px] text-center text-black text-[36px] font-bold font-quantico">
            {item.cost}
          </div>
          <img src={item.image} alt={item.name} className="w-[150px]" />
          <div className="mt-[10px] font-quantico text-center text-black text-[36px] font-bold leading-none">
            {item.displayName}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StoreTabContent;

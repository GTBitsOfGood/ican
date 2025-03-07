import React from "react";

interface StoreItem {
  name: string;
  image: string;
  cost: number;
  description: string;
}

interface StoreTabContentProps {
  items: [StoreItem];
}

const StoreTabContent: React.FC<StoreTabContentProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-3 gap-4 p-4">
      {items.map((item, index) => (
        <div key={index} className="bg-white p-4 rounded">
          <img src={item.image} alt={item.name} className="w-full h-auto" />
          <h3>{item.name}</h3>
          <p>Cost: {item.cost}</p>
        </div>
      ))}
    </div>
  );
};

export default StoreTabContent;

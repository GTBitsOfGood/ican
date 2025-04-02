import { InventoryItem } from "@/types/inventory";
import Image from "next/image";
import React from "react";

export default function ClothingItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[65%] left-[19%] top-[58.5%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Clothing Item"}
        draggable="false"
        className="h-full w-full object-contain pointer-events-none select-none"
        width={0}
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

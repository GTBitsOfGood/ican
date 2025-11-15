import { InventoryItem } from "@/types/inventory";
import Image from "next/image";
import React from "react";

export default function ClothingItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  const isWings =
    selectedItem.name?.includes("WING") || selectedItem.name?.includes("WINGS");
  const widthClass = isWings ? "w-[110%]" : "w-[65%]";
  const leftPosition = isWings ? "left-[-3%]" : "left-[19%]";
  const topPosition = isWings ? "top-[40%]" : "top-[64%]";
  const zIndex = isWings ? "z-0" : "z-20";

  return (
    <div
      className={`absolute ${widthClass} ${leftPosition} ${topPosition} flex items-center justify-center ${zIndex}`}
    >
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

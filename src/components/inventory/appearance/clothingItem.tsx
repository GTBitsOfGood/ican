import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function ClothingItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[60%] translate-x-[4%] translate-y-[78%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Clothing Item"}
        width={145}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

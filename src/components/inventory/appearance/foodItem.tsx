import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function FoodItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[40%] -right-[30%] top-1/2 flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Food Item"}
        draggable="false"
        className="h-full w-full object-contain pointer-events-none select-none"
        width={0}
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

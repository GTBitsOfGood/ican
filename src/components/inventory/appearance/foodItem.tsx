import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function FoodItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[30%] translate-x-[160%] translate-y-[58%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Food Item"}
        width={90}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

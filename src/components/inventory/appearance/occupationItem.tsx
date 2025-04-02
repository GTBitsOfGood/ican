import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function OccupationalItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[43%] translate-x-[80%] translate-y-[70%] flex items-center justify-center z-30">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Occupation Item"}
        width={110}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

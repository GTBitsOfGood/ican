import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function HatItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[80%] left-[8%] top-[8%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Hat Item"}
        draggable="false"
        className="h-full w-full object-contain pointer-events-none select-none"
        width={0}
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

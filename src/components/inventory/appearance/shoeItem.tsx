import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function ShoeItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[60%] left-1/2 -translate-x-1/2 bottom-0 flex items-center justify-center z-10">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Shoes Item"}
        draggable="false"
        className="h-full w-full object-contain pointer-events-none select-none"
        width={0}
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

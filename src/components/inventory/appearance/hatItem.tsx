import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function HatItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[75%] translate-x-[4%] -translate-y-[87%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Hat Item"}
        width={190}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function ShoeItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute w-[57%] desktop:translate-x-[4%] tablet:translate-x-[2%] translate-y-[450%] flex items-center justify-center z-20">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Shoes Item"}
        width={140}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function BackgroundItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute largeDesktop:w-[390px] desktop:w-[300px] tablet:w-[250px] flex items-center justify-center z-0">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Background Item"}
        width={413}
        draggable="false"
        className="object-contain pointer-events-none select-none"
        height={0}
        sizes="100vw"
      />
    </div>
  );
}

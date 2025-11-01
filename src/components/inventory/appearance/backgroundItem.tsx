import { InventoryItem } from "@/types/inventory";
import Image from "next/image";

export default function BackgroundItem({
  selectedItem,
}: {
  selectedItem: InventoryItem;
}) {
  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none select-none">
      <Image
        src={selectedItem.image}
        alt={selectedItem.name || "Background Item"}
        draggable="false"
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}

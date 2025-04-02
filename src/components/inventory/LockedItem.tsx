import React from "react";
import Image from "next/image";
import { InventoryItem } from "@/types/inventory";

interface LockedItemProps {
  item: InventoryItem;
}

const LockedItem: React.FC<LockedItemProps> = ({ item }) => {
  return (
    <div className={`p-4 mx-auto flex flex-col items-center mt-[60px]`}>
      <Image
        src={"store/Lock.svg"}
        alt={item.name}
        className="largeDesktop:w-[121px] largeDesktop:h-[121px] desktop:w-[105px] desktop:h-[105px] tablet:w-[90px] tablet:h-[90px] object-contain"
        height={0}
        width={0}
        sizes="100vw"
      />
      <div className="mt-[23px] font-quantico text-center text-black largeDesktop:text-[36px] desktop:text-[30px] tablet:text-[24px] font-bold leading-none">
        {`Level ${item.level}`}
      </div>
    </div>
  );
};

export default LockedItem;

import React from "react";
import Image from "next/image";
import { InventoryItem } from "@/types/inventory";

interface LockedItemProps {
  item: InventoryItem;
  currentStreak?: number;
}

const LockedItem: React.FC<LockedItemProps> = ({ item, currentStreak = 0 }) => {
  const isStreakLocked =
    item.isStreakLocked && currentStreak < (item.streakRequirement || 3);
  const lockReason = isStreakLocked
    ? `Streak Required: ${item.streakRequirement || 3} days`
    : `Level ${item.level}`;

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
        {lockReason}
      </div>
      {isStreakLocked && (
        <div className="mt-2 font-quantico text-center text-gray-600 text-sm">
          Current: {currentStreak} {currentStreak === 1 ? "day" : "days"}
        </div>
      )}
    </div>
  );
};

export default LockedItem;

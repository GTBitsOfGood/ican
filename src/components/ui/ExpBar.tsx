import { calculateXPForLevel } from "@/utils/constants";
import Image from "next/image";

interface ExpProps {
  level: number;
  currentExp: number;
}

const ExpBar: React.FC<ExpProps> = ({ level, currentExp }) => {
  const xpNeeded = calculateXPForLevel(level);
  const progress = xpNeeded > 0 ? (currentExp / xpNeeded) * 100 : 0;

  return (
    <div className="relative flex h-10 w-fit items-center 4xl:h-11">
      <div className="ml-2.5 h-7 w-40 bg-[#37401e] shadow-exp-outer 4xl:ml-3 4xl:h-8 4xl:w-44">
        <div
          className="h-full border-2 bg-[#c8e57f] border-[#5a711a] shadow-exp-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute left-0 flex h-full w-full flex-row items-center gap-2">
        <div className="relative h-10 w-10 4xl:h-11 4xl:w-11">
          <Image
            src="/icons/Star.svg"
            alt="Level Star"
            fill
            draggable={false}
            className="object-contain select-none"
          />

          <div className="absolute z-auto flex h-full w-full items-center justify-center font-quantico text-center text-[1.05rem] font-bold text-white text-stroke-4 text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke 4xl:text-[1.2rem]">
            {level}
          </div>
        </div>
        <span className="z-10 h-fit font-quantico text-[1.55rem] font-extrabold text-white text-stroke-4 text-stroke-[#2A3213] text-shadow-[#444D29] paint-stroke letter-spacing-ui 4xl:text-[1.75rem]">
          {currentExp}/{xpNeeded} XP
        </span>
      </div>
    </div>
  );
};

export default ExpBar;

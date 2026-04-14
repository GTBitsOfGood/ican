import { calculateXPForLevel } from "@/utils/constants";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ExpProps {
  level: number;
  currentExp: number;
}

const ExpBar: React.FC<ExpProps> = ({ level, currentExp }) => {
  const xpNeeded = calculateXPForLevel(level);
  const progress = xpNeeded > 0 ? (currentExp / xpNeeded) * 100 : 0;
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const label = `${currentExp}/${xpNeeded} XP`;
  const contentRef = useRef<HTMLDivElement>(null);
  const barOffset = 10;
  const minWidth = 166;
  const [contentWidth, setContentWidth] = useState(minWidth);

  useEffect(() => {
    const contentNode = contentRef.current;
    if (!contentNode) return;

    const updateWidth = () => {
      const nextWidth = Math.max(
        minWidth,
        Math.ceil(contentNode.getBoundingClientRect().width),
      );
      setContentWidth((currentWidth) =>
        currentWidth === nextWidth ? currentWidth : nextWidth,
      );
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(contentNode);

    return () => observer.disconnect();
  }, [label, level]);

  const backgroundWidth = Math.max(
    minWidth - barOffset,
    contentWidth - barOffset,
  );

  return (
    <div
      className="relative flex h-[34px] min-w-[166px] flex-1 items-center overflow-visible desktop:h-10 4xl:h-11"
      style={{ width: `${contentWidth}px` }}
    >
      <div
        className="ml-[10px] h-[17px] bg-[#37401e] shadow-exp-outer desktop:ml-2.5 desktop:h-7 4xl:ml-3 4xl:h-8"
        style={{ width: `${backgroundWidth}px` }}
      >
        <div
          className="h-full border-2 border-[#5a711a] bg-[#c8e57f] shadow-exp-inner"
          style={{ width: `${clampedProgress}%` }}
        />
      </div>

      <div
        ref={contentRef}
        className="absolute left-0 top-0 flex h-full w-max flex-row items-center gap-3 desktop:gap-4"
      >
        <div className="relative h-[34px] w-[34px] desktop:h-[42px] desktop:w-[42px] 4xl:h-[46px] 4xl:w-[46px]">
          <Image
            src="/icons/Star.svg"
            alt="Level Star"
            fill
            draggable={false}
            className="object-contain select-none"
          />

          <div className="absolute z-auto flex h-full w-full items-center justify-center font-quantico text-center text-2xl font-bold text-white text-stroke-4 text-stroke-[#482D0D] text-shadow-[#603A0C] paint-stroke">
            {level}
          </div>
        </div>
        <span className="z-10 h-fit whitespace-nowrap font-quantico font-extrabold text-[2rem] text-white text-stroke-4 text-stroke-[#2A3213] text-shadow-[#444D29] paint-stroke letter-spacing-ui">
          {label}
        </span>
      </div>
    </div>
  );
};

export default ExpBar;

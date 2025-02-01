import Image from "next/image";

interface ExpProps {
  level: number;
  currentExp: number;
  totalExp?: number;
}

const ExpBar: React.FC<ExpProps> = ({ level, currentExp, totalExp = 100}) => {
  const progress = totalExp > 0 ? (currentExp / totalExp) * 100 : 0;

  return (
    <div className="relative w-fit h-full flex items-center flex-1">
      {/* XP Bar */}
      <div className="aspect-exp-bar h-3/5 ml-4 bg-[#37401e] shadow-exp-outer 4xl:ml-5">
        <div
          className="h-full w-full border-2 bg-[#c8e57f] border-[#5a711a] shadow-exp-inner"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="absolute left-0 w-full h-full flex flex-row gap-4 items-center">
        <div className="h-full w-auto aspect-square relative">
          <Image src="/icons/Star.svg" alt="Level Star" fill draggable={false} className="object-contain select-none"/>

          <div
            className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] absolute w-full h-full z-auto font-pixelify text-center font-bold text-2xl flex justify-center items-center tracking-tight coin-label"
            style={{
              WebkitTextStrokeWidth: "2px",
              WebkitTextStrokeColor: "#482D0D",
            }}
          >
            {level}
          </div>
        </div>
        <span
          className="[text-shadow:0_2px_0_#444D29] [letter-spacing:-0.12rem] h-fit z-10 font-quantico font-extrabold text-[2rem] text-white exp-bar-label"
        >
          {currentExp}/{totalExp} XP
        </span>
      </div>
    </div>
  );
};

export default ExpBar;

import Image from "next/image";

// Will all xp bars be out of 100?
interface ExpProps {
  level: number;
  currentExp: number;
  totalExp: number;
}

const ExpBar: React.FC<ExpProps> = ({ level, currentExp, totalExp }) => {
  const progress = totalExp > 0 ? (currentExp / totalExp) * 100 : 0;

  return (
    <div className="relative w-full h-12 flex items-center">
      {/* XP Bar */}
      <div className="absolute right-0 h-7 w-11/12 bg-[#37401e] shadow-[inset_0px_-4px_0px_0px_rgba(0,0,0,0.14)]">
        <div
          className="h-full w-full bg-[#c8e57f] border-2 border-[#5a711a]
        shadow-[inset_0rem_-0.375rem_0rem_0rem_#718E1F,inset_0rem_0.25rem_0rem_0rem_#DBEDA6]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="w-full h-full flex flex-row gap-4 items-center">
        <div className="w-12 h-auto aspect-square relative">
          <Image src="/icons/Star.svg" alt="Level Star" fill />
          {/* Need web kit stroke */}
          <div
            className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] absolute w-full h-full z-auto font-pixelify text-center font-bold text-2xl flex justify-center items-center tracking-tight"
            style={{
              WebkitTextStrokeWidth: "2px",
              WebkitTextStrokeColor: "#482D0D",
            }}
          >
            {level}
          </div>
          <div className="[text-shadow:_0_1px_0_rgb(0_0_0_/_40%)] absolute w-full h-full z-auto font-pixelify text-center font-semibold text-2xl flex justify-center items-center tracking-tight">
            {level}
          </div>
        </div>
        <span
          className="[text-shadow:0_2px_0_#444D29] [letter-spacing:-0.12rem] h-fit z-10 font-quantico font-extrabold text-[2rem] text-white"
          style={{
            WebkitTextStrokeWidth: "2px",
            WebkitTextStrokeColor: "#2A3213",
          }}
        >
          {currentExp}/{totalExp} XP
        </span>
      </div>
    </div>
  );
};

export default ExpBar;

import { humanizeDate, humanizeDateComparison } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";

export default function Log() {
  const [date, setDate] = useState<Date>(new Date());

  const handlePrev = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() - 1);
    setDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + 1);
    setDate(newDate);
  };

  return (
    <div className="bg-icanBlue-200 w-screen h-screen flex ">
      <div className="flex flex-col gap-y-[72px]">
        <div className="flex justify-center items-center w-[85vw]">
          <button onClick={handlePrev}>
            <Image
              src={"/assets/LeftArrowIcon.svg"}
              alt=""
              width={106}
              height={106}
            />
          </button>
          <h2 className="text-[64px] font-bold font-quantico text-white">
            {humanizeDateComparison(date)}, {humanizeDate(date)}
          </h2>
          <button onClick={handleNext}>
            <Image
              src={"/assets/RightArrowIcon.svg"}
              alt=""
              width={106}
              height={106}
            />
          </button>
        </div>
      </div>
      <div className="p-9">
        <button>
          <Image
            src={"/assets/CloseIcon.svg"}
            alt=""
            width={28}
            height={28}
            sizes="100vw"
          />
        </button>
      </div>
    </div>
  );
}

import MedicationLogCard, {
  MedicationLogCardProps,
} from "@/components/ui/MedicationLogCard";
import {
  humanizeDate,
  humanizeDateComparison,
  standardizeTime,
} from "@/utils/date";
import Image from "next/image";
import { useState } from "react";

type ScheduledTime = {
  time: string;
  status: "pending" | "taken" | "missed";
};

type LogType = {
  id: string;
  name: string;
  dosage: string;
  notes: string;
  scheduledTimes: ScheduledTime[];
  // date as a string
  lastTaken: string;
  repeatUnit: "days" | "weeks" | "months";
  repeatInterval: number;
};

export default function Log() {
  const [currDate, setCurrDate] = useState<Date>(new Date());

  const [data] = useState<{ date: string; medications: LogType[] }>({
    date: "2025-03-23",
    medications: [
      {
        id: "med-001",
        name: "DUPIX",
        dosage: "2 Pills",
        notes: "Take with water and food before!",
        scheduledTimes: [
          {
            time: "10:20 AM",
            status: "pending", // Possible values: "pending", "taken", "missed"
          },
        ],
        lastTaken: "2025-03-09T09:00:00Z",
        repeatUnit: "days",
        repeatInterval: 1,
      },
      {
        id: "med-002",
        name: "TYLEN",
        dosage: "100 mg",
        notes: "Take with water and food before!",
        scheduledTimes: [
          {
            time: "09:00 AM",
            status: "taken",
          },
          {
            time: "11:00 AM",
            status: "missed",
          },
        ],
        lastTaken: "2025-03-09T11:00:00Z",
        repeatUnit: "days",
        repeatInterval: 1,
      },
      {
        id: "med-003",
        name: "TYLEN",
        dosage: "200 mg",
        notes: "Take with water and food before!",
        scheduledTimes: [
          {
            time: "1:00 PM",
            status: "taken",
          },
          {
            time: "1:00 AM",
            status: "missed",
          },
        ],
        lastTaken: "2025-03-09T11:00:00Z",
        repeatUnit: "days",
        repeatInterval: 1,
      },
    ],
  });

  const handlePrev = () => {
    const newDate = new Date(currDate);
    newDate.setDate(currDate.getDate() - 1);
    setCurrDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currDate);
    newDate.setDate(currDate.getDate() + 1);
    setCurrDate(newDate);
  };

  const flatMapMedications = () => {
    let flatArr: MedicationLogCardProps[] = [];

    for (let i = 0; i < data.medications.length; i++) {
      for (let j = 0; j < data.medications[i].scheduledTimes.length; j++) {
        const inputData: MedicationLogCardProps = {
          ...data.medications[i],
          ...data.medications[i].scheduledTimes[j],
        };
        flatArr.push(inputData);
      }
    }

    flatArr = flatArr.sort((a, b) => {
      const aTime = standardizeTime(a.time);
      const bTime = standardizeTime(b.time);
      console.log(a.time, aTime, b.time, bTime);

      const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
      const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

      return aTotalMinutes - bTotalMinutes;
    });

    console.log(flatArr);
    return flatArr;
  };

  return (
    <div className="bg-icanBlue-200 w-screen min-h-screen flex justify-between">
      <div className="flex flex-col gap-y-[72px] w-full">
        <div className="flex justify-center items-center">
          <button onClick={handlePrev}>
            <Image
              src={"/assets/LeftArrowIcon.svg"}
              alt=""
              width={106}
              height={106}
            />
          </button>
          <h2 className="text-[64px] font-bold font-quantico text-white">
            {humanizeDateComparison(currDate)}, {humanizeDate(currDate)}
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
        <div className="flex flex-wrap justify-between">
          {flatMapMedications().map(
            (log: MedicationLogCardProps, idx: number) => {
              return <MedicationLogCard {...log} key={idx} />;
            },
          )}
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

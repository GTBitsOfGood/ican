import MedicationLogCard from "@/components/ui/MedicationLogCard";
import { LogType } from "@/types/log";
import { humanizeDate, humanizeDateComparison } from "@/utils/date";
import { isNextDay, isPastDay, isSameDay, standardizeTime } from "@/utils/time";
import Image from "next/image";
import { useState } from "react";

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
        canCheckIn: false,
        scheduledDoseTime: "09:00AM",
        status: "pending",
        lastTaken: "2025-04-04T11:00:00Z",
        repeatUnit: "days",
        repeatInterval: 1,
      },
      {
        id: "med-002",
        name: "TYLEN",
        dosage: "100 mg",
        notes: "Take with water and food before!",
        canCheckIn: true,
        scheduledDoseTime: "06:00AM",
        status: "taken",
        lastTaken: "2025-04-05T09:00:00Z",
        repeatUnit: "days",
        repeatInterval: 1,
      },
      {
        id: "med-002",
        name: "TYLEN",
        dosage: "100 mg",
        notes: "Take with water and food before!",
        canCheckIn: true,
        scheduledDoseTime: "11:00AM",
        status: "pending",
        lastTaken: "2025-04-04T09:00:00Z",
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

  const sortLogs = () => {
    return data.medications.sort((a, b) => {
      const aTime = standardizeTime(a.scheduledDoseTime);
      const bTime = standardizeTime(b.scheduledDoseTime);
      console.log(a.scheduledDoseTime, aTime, b.scheduledDoseTime, bTime);

      const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
      const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

      return aTotalMinutes - bTotalMinutes;
    });
  };

  const filterPastDoses = () => {
    const pastDoses = data.medications.filter((med) => {
      if (med.status === "missed" || med.status === "taken") {
        return true;
      }
      return false;
    });

    return pastDoses;
  };

  const filterFutureDoses = () => {
    const futureDoses = data.medications.filter((med) => {
      if (med.status === "pending") {
        return true;
      }
      return false;
    });

    return futureDoses;
  };

  const handleCloseIcon = () => {
    window.location.href = "/";
  };

  return (
    <div className="bg-icanBlue-200 w-screen min-h-screen p-16">
      <div className="mb-[72px]">
        <div className="flex justify-between">
          <div className="flex justify-center items-center w-full">
            <button onClick={handlePrev}>
              <Image
                src={"/assets/LeftArrowIcon.svg"}
                alt=""
                width={106}
                height={106}
                className={`${isPastDay(currDate) ? "hidden" : "visible"}`}
              />
            </button>
            <h2 className="text-[32px] desktop:text-[48px] font-bold font-quantico text-white">
              {humanizeDateComparison(currDate)}, {humanizeDate(currDate)}
            </h2>
            <button onClick={handleNext}>
              <Image
                src={"/assets/RightArrowIcon.svg"}
                alt=""
                width={106}
                height={106}
                className={`${isNextDay(currDate) ? "hidden" : "visible"}`}
              />
            </button>
          </div>
          <div className="py-9">
            <button>
              <Image
                src={"/assets/CloseIcon.svg"}
                alt=""
                width={46}
                height={46}
                onClick={handleCloseIcon}
              />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-y-[48px] w-full overflow-y-auto log-scrollbar h-screen">
          {isSameDay(currDate) ? (
            <>
              <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                {filterFutureDoses().map((log: LogType, idx: number) => {
                  return <MedicationLogCard {...log} key={idx} />;
                })}
              </div>
              <div className="flex flex-col gap-y-6">
                <h1 className="text-6xl font-quantico font-bold text-center largeDesktop:text-start">
                  Previous Doses
                </h1>
                <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                  {filterPastDoses().map((log: LogType, idx: number) => {
                    return <MedicationLogCard {...log} key={idx} />;
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
              {sortLogs().map((log: LogType, idx: number) => {
                if (isNextDay(currDate)) {
                  // if next day should not be allowed to check in
                  return (
                    <MedicationLogCard
                      {...log}
                      key={idx}
                      status="pending"
                      canCheckIn={false}
                    />
                  );
                }

                const status = isPastDay(new Date(log.lastTaken));

                return (
                  <MedicationLogCard
                    {...log}
                    key={idx}
                    status={status ? "taken" : "missed"}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

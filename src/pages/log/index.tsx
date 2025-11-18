import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useMedicationSchedule } from "@/components/hooks/useMedication";
import MedicationLogCard from "@/components/ui/MedicationLogCard";
import { LogType } from "@/types/log";
import { humanizeDate, humanizeDateComparison } from "@/utils/date";
import { isNextDay, isPastDay, isSameDay, standardizeTime } from "@/utils/time";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Log() {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const router = useRouter();

  const getDateString = (date: Date, offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const localTime = new Date().toLocaleString();

  const { data: yesterdayData } = useMedicationSchedule(
    getDateString(currDate, -1),
    localTime,
  );

  const { data: todayData } = useMedicationSchedule(
    getDateString(currDate, 0),
    localTime,
  );

  const { data: tomorrowData } = useMedicationSchedule(
    getDateString(currDate, 1),
    localTime,
  );

  const data = {
    yesterday: yesterdayData || { date: "", medications: [] },
    today: todayData || { date: "", medications: [] },
    tomorrow: tomorrowData || { date: "", medications: [] },
  };

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

  const sortLogs = (day: "yesterday" | "today" | "tomorrow") => {
    if (!data[day]) return [];

    return [...data[day].medications].sort((a, b) => {
      const aTime = standardizeTime(a.scheduledDoseTime);
      const bTime = standardizeTime(b.scheduledDoseTime);
      console.log(a.scheduledDoseTime, aTime, b.scheduledDoseTime, bTime);

      const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
      const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

      return aTotalMinutes - bTotalMinutes;
    });
  };

  const filterPastDoses = (day: "yesterday" | "today" | "tomorrow") => {
    if (!data[day]) return [];

    const pastDoses = data[day].medications.filter((med) => {
      if (med.status === "missed" || med.status === "taken") {
        return true;
      }
      return false;
    });

    return pastDoses;
  };

  const filterFutureDoses = (day: "yesterday" | "today" | "tomorrow") => {
    if (!data[day]) return [];

    const futureDoses = data[day].medications.filter((med) => {
      if (med.status === "pending") {
        return true;
      }
      return false;
    });

    return futureDoses;
  };

  const handleCloseIcon = () => {
    router.push("/");
  };

  return (
    <AuthorizedRoute>
      <div className="bg-icanBlue-200 p-16 min-h-screen">
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
          <div className="flex flex-col gap-y-[48px] w-full overflow-y-auto log-scrollbar">
            {isSameDay(currDate) ? (
              <>
                <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                  {filterFutureDoses("today")?.map(
                    (log: LogType, idx: number) => {
                      return <MedicationLogCard {...log} key={idx} />;
                    },
                  )}
                </div>
                <div className="flex flex-col gap-y-6">
                  <h1 className="text-6xl font-quantico font-bold text-center largeDesktop:text-start">
                    Previous Doses
                  </h1>
                  <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                    {filterPastDoses("today")?.map(
                      (log: LogType, idx: number) => {
                        return <MedicationLogCard {...log} key={idx} />;
                      },
                    )}
                  </div>
                </div>
              </>
            ) : isNextDay(currDate) ? (
              <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                {sortLogs("tomorrow")?.map((log: LogType, idx: number) => {
                  // if next day should not be allowed to check in
                  return (
                    <MedicationLogCard
                      {...log}
                      key={idx}
                      status="pending"
                      canCheckIn={false}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                {sortLogs("yesterday")?.map((log: LogType, idx: number) => {
                  return (
                    <MedicationLogCard {...log} key={idx} canCheckIn={false} />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}

import AuthorizedRoute from "@/components/AuthorizedRoute";
import MedicationLogCard from "@/components/ui/MedicationLogCard";
import { useUser } from "@/components/UserContext";
import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { LogType } from "@/types/log";
import { humanizeDate, humanizeDateComparison } from "@/utils/date";
import { isNextDay, isPastDay, isSameDay, standardizeTime } from "@/utils/time";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Log() {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const { userId } = useUser();
  console.log(userId);

  const [data, setData] = useState<{
    today: { date: string; medications: LogType[] };
    yesterday: { date: string; medications: LogType[] };
    tomorrow: { date: string; medications: LogType[] };
  }>();

  useEffect(() => {
    const init = async () => {
      console.log(userId);
      if (!userId) {
        return;
      } // curr date data

      try {
        const now = new Date();

        const obj: {
          today: { date: string; medications: LogType[] };
          yesterday: { date: string; medications: LogType[] };
          tomorrow: { date: string; medications: LogType[] };
        } = {
          today: {
            date: "",
            medications: [],
          },
          yesterday: {
            date: "",
            medications: [],
          },
          tomorrow: {
            date: "",
            medications: [],
          },
        };

        for (let x = -1; x < 2; x++) {
          const date = new Date();
          date.setDate(now.getDate() + x);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          console.log(userId);

          const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
          console.log(timezone);
          const data = await MedicationHTTPClient.getMedicationSchedule(
            userId as string,
            `${year}-${month}-${day}`,
            timezone,
          );

          console.log(data);

          if (x === -1) {
            obj["yesterday"] = data;
          } else if (x === 0) {
            obj["today"] = data;
          } else if (x === 1) {
            obj["tomorrow"] = data;
          }
        }

        setData(obj);
      } catch (e) {
        console.log(e);
      }
    };
    init();
  }, [userId]);

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
    if (day === "today")
      return data?.today.medications.sort((a, b) => {
        const aTime = standardizeTime(a.scheduledDoseTime);
        const bTime = standardizeTime(b.scheduledDoseTime);
        console.log(a.scheduledDoseTime, aTime, b.scheduledDoseTime, bTime);

        const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
        const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

        return aTotalMinutes - bTotalMinutes;
      });

    if (day === "tomorrow")
      return data?.tomorrow.medications.sort((a, b) => {
        const aTime = standardizeTime(a.scheduledDoseTime);
        const bTime = standardizeTime(b.scheduledDoseTime);
        console.log(a.scheduledDoseTime, aTime, b.scheduledDoseTime, bTime);

        const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
        const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

        return aTotalMinutes - bTotalMinutes;
      });

    if (day === "yesterday")
      return data?.yesterday.medications.sort((a, b) => {
        const aTime = standardizeTime(a.scheduledDoseTime);
        const bTime = standardizeTime(b.scheduledDoseTime);
        console.log(a.scheduledDoseTime, aTime, b.scheduledDoseTime, bTime);

        const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
        const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

        return aTotalMinutes - bTotalMinutes;
      });
  };

  const filterPastDoses = (day: "yesterday" | "today" | "tomorrow") => {
    if (!data) return;

    const pastDoses = data[day].medications.filter((med) => {
      if (med.status === "missed" || med.status === "taken") {
        return true;
      }
      return false;
    });

    return pastDoses;
  };

  const filterFutureDoses = (day: "yesterday" | "today" | "tomorrow") => {
    if (!data) return;
    const futureDoses = data[day].medications.filter((med) => {
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
    <AuthorizedRoute>
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

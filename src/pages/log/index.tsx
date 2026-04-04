import AuthorizedRoute from "@/components/AuthorizedRoute";
import BackButton from "@/components/ui/BackButton";
import { useMedicationSchedule } from "@/components/hooks/useMedication";
import MedicationLogCard from "@/components/ui/MedicationLogCard";
import { useTutorial } from "@/components/TutorialContext";
import { LogType } from "@/types/log";
import { humanizeDate, humanizeDateComparison } from "@/utils/date";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";
import { isNextDay, isPastDay, isSameDay, standardizeTime } from "@/utils/time";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/router";

const TUTORIAL_MEDICATION_NAME = "PRACTICE DOSE";

export default function Log() {
  const [currDate, setCurrDate] = useState<Date>(new Date());
  const router = useRouter();
  const tutorial = useTutorial();

  const getDateString = (date: Date, offset: number) => {
    const newDate = new Date(date);
    newDate.setDate(date.getDate() + offset);
    const year = newDate.getFullYear();
    const month = String(newDate.getMonth() + 1).padStart(2, "0");
    const day = String(newDate.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const currentTimestamp = new Date().toISOString();
  const activeDate = getDateString(currDate, 0);

  const { data: scheduleData } = useMedicationSchedule(
    activeDate,
    currentTimestamp,
  );
  const currentDayData = scheduleData || { date: "", medications: [] };

  const normalTodayMeds = tutorial.isActive
    ? currentDayData.medications
    : currentDayData.medications.filter(
        (med) => med.name !== TUTORIAL_MEDICATION_NAME,
      );

  const fallbackPracticeDose =
    tutorial.isActive &&
    isSameDay(currDate) &&
    tutorial.tutorialPortion === TUTORIAL_PORTIONS.LOG_TUTORIAL &&
    !tutorial.shouldShowMedicationDrag &&
    tutorial.practiceDose
      ? [
          {
            id: tutorial.practiceDose.medicationId,
            name: TUTORIAL_MEDICATION_NAME,
            formOfMedication: "Pill" as const,
            dosage: "0 pills",
            notes: "practice dose",
            scheduledDoseTime: tutorial.practiceDose.scheduledDoseTime,
            includeTimes: true,
            canCheckIn: true,
            status: "pending" as const,
            lastTaken: "",
            repeatUnit: "days" as const,
            repeatInterval: 1,
          },
        ]
      : [];

  const tutorialOnlyTodayMeds =
    tutorial.isActive &&
    currDate.toDateString() === new Date().toDateString() &&
    tutorial.tutorialPortion >= TUTORIAL_PORTIONS.LOG_TUTORIAL
      ? (() => {
          const tutorialMeds = currentDayData.medications.filter(
            (med) => med.name === TUTORIAL_MEDICATION_NAME,
          );
          return tutorialMeds.length > 0 ? tutorialMeds : fallbackPracticeDose;
        })()
      : normalTodayMeds;

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

  const sortLogs = (medications: LogType[]) => {
    return [...medications].sort((a, b) => {
      const aTime = standardizeTime(a.scheduledDoseTime);
      const bTime = standardizeTime(b.scheduledDoseTime);

      const aTotalMinutes = aTime.hours * 60 + aTime.minutes;
      const bTotalMinutes = bTime.hours * 60 + bTime.minutes;

      return aTotalMinutes - bTotalMinutes;
    });
  };

  const filterPastDoses = (medications: LogType[]) => {
    const pastDoses = medications.filter((med) => {
      if (med.status === "missed" || med.status === "taken") {
        return true;
      }
      return false;
    });

    return pastDoses;
  };

  const filterFutureDoses = (medications: LogType[]) => {
    const futureDoses = medications.filter((med) => {
      if (med.status === "pending") {
        return true;
      }
      return false;
    });

    return futureDoses;
  };

  const handleBackClick = () => {
    router.push("/");
  };

  return (
    <AuthorizedRoute>
      <div className="bg-icanBlue-200 p-16 min-h-screen">
        <div className="mb-[72px]">
          <div className="flex items-start justify-between">
            <div className="py-9">
              <div className="h-16 w-16">
                <BackButton onClick={handleBackClick} />
              </div>
            </div>
            <div className="flex justify-center items-center w-full">
              <button onClick={handlePrev} disabled={tutorial.isActive}>
                <Image
                  src={"/assets/LeftArrowIcon.svg"}
                  alt=""
                  width={106}
                  height={106}
                  className={`${isPastDay(currDate) || tutorial.isActive ? "hidden" : "visible"}`}
                />
              </button>
              <h2 className="text-[32px] desktop:text-[48px] font-bold font-quantico text-white">
                {humanizeDateComparison(currDate)}, {humanizeDate(currDate)}
              </h2>
              <button onClick={handleNext} disabled={tutorial.isActive}>
                <Image
                  src={"/assets/RightArrowIcon.svg"}
                  alt=""
                  width={106}
                  height={106}
                  className={`${isNextDay(currDate) || tutorial.isActive ? "hidden" : "visible"}`}
                />
              </button>
            </div>
            <div className="w-16" />
          </div>
          <div className="flex flex-col gap-y-[48px] w-full overflow-y-auto log-scrollbar">
            {isSameDay(currDate) ? (
              <>
                <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                  {filterFutureDoses(tutorialOnlyTodayMeds)?.map(
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
                    {filterPastDoses(tutorialOnlyTodayMeds)?.map(
                      (log: LogType, idx: number) => {
                        return <MedicationLogCard {...log} key={idx} />;
                      },
                    )}
                  </div>
                </div>
              </>
            ) : isNextDay(currDate) ? (
              <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                {sortLogs(currentDayData.medications)?.map(
                  (log: LogType, idx: number) => {
                    // if next day should not be allowed to check in
                    return (
                      <MedicationLogCard
                        {...log}
                        key={idx}
                        status="pending"
                        canCheckIn={false}
                      />
                    );
                  },
                )}
              </div>
            ) : (
              <div className="flex flex-wrap justify-center largeDesktop:justify-start gap-8">
                {sortLogs(currentDayData.medications)?.map(
                  (log: LogType, idx: number) => {
                    return (
                      <MedicationLogCard
                        {...log}
                        key={idx}
                        canCheckIn={false}
                      />
                    );
                  },
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </AuthorizedRoute>
  );
}

import React from "react";
import { Pill, Trash, PencilSimple } from "@phosphor-icons/react";
import { Medication } from "@/db/models/medication";
import { convertTo12Hour } from "@/utils/time";
import { WithId } from "@/types/models";

interface MedicationCardProps {
  index: number;
  medication: WithId<Medication>;
  setDeleteModalVisible: (visible: boolean) => void;
  setClickedIndex: (index: number) => void;
}

export default function MedicationCard({
  index,
  medication,
  setDeleteModalVisible,
  setClickedIndex,
}: MedicationCardProps) {
  const getNextDosePhrase = (medication: WithId<Medication>): string => {
    console.log(medication);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const getOrdinal = (day: number): string => {
      if (day > 3 && day < 21) return `${day}th`;
      switch (day % 10) {
        case 1:
          return `${day}st`;
        case 2:
          return `${day}nd`;
        case 3:
          return `${day}rd`;
        default:
          return `${day}th`;
      }
    };

    const formatDateWithMonth = (date: Date): string => {
      const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return `${months[date.getMonth()]} ${getOrdinal(date.getDate())}`;
    };

    const getDayName = (dayIndex: number): string => {
      const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      return days[dayIndex];
    };

    let nextDoseDate: Date;

    if (medication.repeatUnit === "Day") {
      nextDoseDate = new Date(today);
      nextDoseDate.setDate(today.getDate() + (medication.repeatInterval || 1));
    } else if (medication.repeatUnit === "Week") {
      const targetDay = medication.repeatWeeklyOn[0];
      const targetDayIndex = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ].indexOf(targetDay);

      nextDoseDate = new Date(today);
      const daysUntilTarget = (targetDayIndex - today.getDay() + 7) % 7;
      const repeatInterval = medication.repeatInterval || 1;

      if (daysUntilTarget === 0 && repeatInterval === 1) {
        nextDoseDate.setDate(today.getDate() + 7);
      } else if (daysUntilTarget === 0) {
        nextDoseDate = new Date(today);
      } else {
        nextDoseDate.setDate(
          today.getDate() + daysUntilTarget + (repeatInterval - 1) * 7,
        );
      }
    } else {
      nextDoseDate = new Date(today);
      nextDoseDate.setMonth(
        today.getMonth() + (medication.repeatInterval || 1),
      );

      if (
        medication.repeatMonthlyType === "Day" &&
        medication.repeatMonthlyOnDay
      ) {
        nextDoseDate.setDate(medication.repeatMonthlyOnDay);
      } else if (
        medication.repeatMonthlyType === "Week" &&
        medication.repeatMonthlyOnWeek &&
        medication.repeatMonthlyOnWeekDay
      ) {
        const targetDayIndex = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ].indexOf(medication.repeatMonthlyOnWeekDay);
        const weekNumber = medication.repeatMonthlyOnWeek;

        nextDoseDate.setDate(1);

        const firstDayOfMonth = nextDoseDate.getDay();
        const daysToFirstOccurrence =
          (targetDayIndex - firstDayOfMonth + 7) % 7;

        const targetDate = 1 + daysToFirstOccurrence + (weekNumber - 1) * 7;
        nextDoseDate.setDate(targetDate);

        if (nextDoseDate <= today) {
          nextDoseDate.setMonth(
            nextDoseDate.getMonth() + (medication.repeatInterval || 1),
          );
          nextDoseDate.setDate(1);
          const firstDayOfNextMonth = nextDoseDate.getDay();
          const daysToFirstOccurrenceNext =
            (targetDayIndex - firstDayOfNextMonth + 7) % 7;
          const targetDateNext =
            1 + daysToFirstOccurrenceNext + (weekNumber - 1) * 7;
          nextDoseDate.setDate(targetDateNext);
        }
      }
    }

    let dayPhrase: string;
    const diffDays = Math.ceil(
      (nextDoseDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
    );

    const startOfThisWeek = new Date(today);
    startOfThisWeek.setDate(today.getDate() - today.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfNextWeek = new Date(startOfThisWeek);
    startOfNextWeek.setDate(startOfThisWeek.getDate() + 7);

    const endOfNextWeek = new Date(startOfNextWeek);
    endOfNextWeek.setDate(startOfNextWeek.getDate() + 6);
    endOfNextWeek.setHours(23, 59, 59, 999);

    if (diffDays === 1) {
      dayPhrase = "Tomorrow";
    } else if (
      nextDoseDate >= startOfThisWeek &&
      nextDoseDate < startOfNextWeek
    ) {
      dayPhrase = `This ${getDayName(nextDoseDate.getDay())}`;
    } else if (
      nextDoseDate >= startOfNextWeek &&
      nextDoseDate <= endOfNextWeek
    ) {
      dayPhrase = `Next ${getDayName(nextDoseDate.getDay())}`;
    } else {
      dayPhrase = formatDateWithMonth(nextDoseDate);
    }

    if (
      medication.doseTimes &&
      medication.doseTimes.length &&
      medication.includeTimes
    ) {
      const timeInfo = convertTo12Hour(medication.doseTimes)[0];
      return `${dayPhrase}, ${timeInfo.time} ${timeInfo.period}`;
    }

    return dayPhrase;
  };

  const notificationFrequency =
    medication.notificationFrequency === "Every Dose"
      ? "Every Dose"
      : "Day Of Dose";

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
    setClickedIndex(index);
  };

  return (
    <div className="bg-white p-4 text-black flex flex-col justify-between gap-6 items-center shadow-medicationCardShadow">
      <a
        className="flex w-full flex-col gap-4 items-center"
        href={`/medications/edit/${medication._id}`}
      >
        <div className="flex items-center gap-2 self-start mb-4">
          <Pill
            className="mobile:w-[24px] mobile:h-[24px] tablet:w-[28px] tablet:h-[28px] desktop:w-[32px] desktop:h-[32px] largeDesktop:w-[36px] largeDesktop:h-[36px]"
            weight="light"
          />
          <h1 className="mobile:text-xl tablet:text-2xl desktop:text-3xl largeDesktop:text-4xl font-quantico underline">
            {medication.customMedicationId}
          </h1>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Dosage:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2">
            {medication.dosageAmount}
          </p>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Next Dose:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2">
            {getNextDosePhrase(medication)}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Notification Type:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2">
            {notificationFrequency}
          </p>
        </div>
      </a>
      <div className="flex justify-between items-center w-full">
        <Trash
          className="hover:cursor-pointer mobile:w-[34px] mobile:h-[34px] tablet:w-[38px] tablet:h-[38px] desktop:w-[42px] desktop:h-[42px] largeDesktop:w-[46px] largeDesktop:h-[46px]"
          onClick={handleDeleteClick}
          color="#FF0000"
          weight="light"
        />
        <a
          href={`/medications/edit/${medication._id}`}
          className="hover:cursor-pointer"
        >
          <PencilSimple
            className="hover:cursor-pointer mobile:w-[34px] mobile:h-[34px] tablet:w-[38px] tablet:h-[38px] desktop:w-[42px] desktop:h-[42px] largeDesktop:w-[46px] largeDesktop:h-[46px]"
            weight="light"
          />
        </a>
      </div>
    </div>
  );
}

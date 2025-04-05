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
  let day = "";
  const notificationFrequency =
    medication.notificationFrequency === "Every Dose"
      ? "Every Dose"
      : "Day Of Dose";
  if (medication.repeatUnit === "Day") {
    if (medication.repeatInterval === 1) {
      day = "Tomorrow";
    } else {
      day = `In ${medication.repeatInterval} days`;
    }
  } else if (medication.repeatUnit === "Week") {
    // TODO: this assumes that weekly medicine only occurs on one day of the week
    const dayOfWeek = () => {
      return medication.repeatWeeklyOn[0];
    };
    if (medication.repeatInterval === 1) {
      day = `Next ${dayOfWeek()}`;
    } else {
      // TODO: this assumes that weekly medicine only occurs on one day of the week
      day = `In ${medication.repeatInterval} ${dayOfWeek()}s`;
    }
  } else {
    if (medication.repeatInterval === 1) {
      if (medication.repeatMonthlyType === "Day") {
        day = `Next Month on the ${medication.repeatMonthlyOnDay}`;
      } else {
        day = `Next Month on the ${medication.repeatMonthlyOnWeek} ${medication.repeatMonthlyOnWeekDay}`;
      }
    } else {
      if (medication.repeatMonthlyType === "Day") {
        day = `In ${medication.repeatInterval} months on the ${medication.repeatMonthlyOnDay}`;
      } else {
        day = `In ${medication.repeatInterval} months on the ${medication.repeatMonthlyOnWeek} ${medication.repeatMonthlyOnWeekDay}`;
      }
    }
  }

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
    setClickedIndex(index);
  };

  return (
    <div className="bg-white p-4 text-black flex flex-col justify-between gap-6 items-center shadow-medicationCardShadow">
      <a
        className="flex w-full flex-col gap-4 items-center"
        href="/edit-new-medication"
        target="_blank"
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
            Next Scheduled Dose:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2">
            {day}
            {medication.doseTimes && medication.doseTimes.length
              ? ", ".concat(
                  // TODO: this assumes that the first dose time is the next scheduled dose
                  // TODO: convert to 12 hour time twice is inefficient
                  convertTo12Hour(medication.doseTimes)[0].time,
                  " ",
                  convertTo12Hour(medication.doseTimes)[0].period,
                )
              : ""}
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
          href={`/edit-medication/${medication._id}`}
          target="_blank"
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

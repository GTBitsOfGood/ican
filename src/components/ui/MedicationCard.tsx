import React from "react";
import { AddMedicationInfo } from "../modals/addMedication/addMedicationInfo";
import { Pill, Trash, PencilSimple } from "@phosphor-icons/react";

interface MedicationCardProps {
  index: number;
  medication: AddMedicationInfo;
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
    medication.dosage.notificationFrequency === "Every Dose"
      ? "Every Dose"
      : "Day Of Dose";
  if (medication.repetition.type === "Day(s)") {
    if (medication.repetition.repeatEvery === 1) {
      day = "Tomorrow";
    } else {
      day = `In ${medication.repetition.repeatEvery} days`;
    }
  } else if (medication.repetition.type === "Week(s)") {
    const dayOfWeek = () => {
      switch (medication.repetition.weeklyRepetition[0]) {
        case 0:
          return "Sunday";
        case 1:
          return "Monday";
        case 2:
          return "Tuesday";
        case 3:
          return "Wednesday";
        case 4:
          return "Thursday";
        case 5:
          return "Friday";
        case 6:
          return "Saturday";
        default:
          return "ERROR";
      }
    };
    if (medication.repetition.repeatEvery === 1) {
      day = `Next ${dayOfWeek()}`;
    } else {
      day = `In ${medication.repetition.repeatEvery} ${dayOfWeek()}s`;
    }
  } else {
    if (medication.repetition.repeatEvery === 1) {
      if (medication.repetition.monthlyRepetition === "Day") {
        day = `Next Month on the ${medication.repetition.monthlyDayOfRepetition}`;
      } else {
        day = `Next Month on the ${medication.repetition.monthlyWeekOfRepetition} ${medication.repetition.monthlyWeekDayOfRepetition}`;
      }
    } else {
      if (medication.repetition.monthlyRepetition === "Day") {
        day = `In ${medication.repetition.repeatEvery} months on the ${medication.repetition.monthlyDayOfRepetition}`;
      } else {
        day = `In ${medication.repetition.repeatEvery} months on the ${medication.repetition.monthlyWeekOfRepetition} ${medication.repetition.monthlyWeekDayOfRepetition}`;
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
            {medication.general.medicationId}
          </h1>
        </div>
        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Next Scheduled Dose:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2">
            {day}
            {medication.times && medication.times.length
              ? ", ".concat(
                  medication.times[0].time,
                  " ",
                  medication.times[0].period,
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
          href="/edit-new-medication"
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

import React, { useMemo } from "react";
import { Pill, Trash, PencilSimple } from "@phosphor-icons/react";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import { convertTo12Hour } from "@/utils/time";
import { getNextDosePhrase as calculateNextDosePhrase } from "@/lib/medicationDoseCalculator";

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
  const nextDosePhrase = useMemo(() => {
    const result = calculateNextDosePhrase(medication);

    if (medication.doseTimes?.length && medication.includeTimes) {
      const timeInfo = convertTo12Hour(medication.doseTimes)[0];
      return `${result.phrase}, ${timeInfo.time} ${timeInfo.period}`;
    }

    return result.phrase;
  }, [medication]);

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
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
            {medication.dosageAmount}
          </p>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Next Dose:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
            {nextDosePhrase}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Notification Type:
          </p>
          <p className="font-quantico mobile:text-md tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
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

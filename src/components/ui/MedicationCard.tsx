import React, { useMemo } from "react";
import { Trash, PencilSimple } from "@phosphor-icons/react";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import { convertTo12Hour } from "@/utils/time";
import { getNextDosePhrase as calculateNextDosePhrase } from "@/lib/medicationDoseCalculator";
import Link from "next/link";
import {
  PillIcon,
  LiquidIcon,
  InjectionIcon,
} from "@/components/ui/modals/medicationIcons";

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

  const getMedicationIcon = (className: string) => {
    switch (medication.formOfMedication) {
      case "Pill":
        return <PillIcon className={className} />;
      case "Syrup":
        return <LiquidIcon className={className} />;
      case "Shot":
        return <InjectionIcon className={className} />;
      default:
        return <PillIcon className={className} />;
    }
  };

  const handleDeleteClick = () => {
    setDeleteModalVisible(true);
    setClickedIndex(index);
  };

  return (
    <div className="bg-white p-4 text-black flex flex-col justify-between gap-6 items-center shadow-medicationCardShadow mobile:rounded-lg tablet:rounded-none">
      {/* Mobile Layout */}
      <div className="flex flex-col w-full tablet:hidden">
        <div className="flex justify-between items-start w-full mb-2">
          <p className="font-quantico text-base font-bold text-black">
            {nextDosePhrase}
          </p>
          <Link
            href={`/medications/edit/${medication._id}`}
            className="hover:cursor-pointer"
          >
            <PencilSimple
              className="hover:cursor-pointer w-[20px] h-[20px]"
              weight="light"
              color="#000000"
            />
          </Link>
        </div>
        <div className="flex items-center gap-2 self-start mb-2">
          {getMedicationIcon("w-[16px] h-[16px]")}
          <h1 className="text-lg font-quantico underline font-bold">
            {medication.customMedicationId}
          </h1>
        </div>
        <div className="flex items-center gap-2 self-start mb-2">
          <p className="font-quantico text-sm text-black">
            Notify : {notificationFrequency}
          </p>
        </div>
        {medication.dosageAmount && (
          <div className="flex flex-col w-full mb-2">
            <p className="font-quantico text-sm text-black">
              {medication.dosageAmount}
            </p>
          </div>
        )}
        <div className="flex justify-end items-center w-full mt-auto">
          <Trash
            className="hover:cursor-pointer w-[24px] h-[24px]"
            onClick={handleDeleteClick}
            color="#FF0000"
            weight="light"
          />
        </div>
      </div>

      {/* Desktop Layout */}
      <Link
        className="hidden tablet:flex w-full flex-col gap-4 items-center"
        href={`/medications/edit/${medication._id}`}
      >
        <div className="flex items-center gap-2 self-start mb-4">
          {getMedicationIcon(
            "tablet:w-[28px] tablet:h-[28px] desktop:w-[32px] desktop:h-[32px] largeDesktop:w-[36px] largeDesktop:h-[36px]",
          )}
          <h1 className="tablet:text-2xl desktop:text-3xl largeDesktop:text-4xl font-quantico underline">
            {medication.customMedicationId}
          </h1>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Dosage:
          </p>
          <p className="font-quantico tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
            {medication.dosageAmount}
          </p>
        </div>

        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Next Dose:
          </p>
          <p className="font-quantico tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
            {nextDosePhrase}
          </p>
        </div>
        <div className="flex flex-col w-full">
          <p className="font-quantico font-bold tablet:text-lg desktop:text-xl largeDesktop:text-2xl">
            Notification Type:
          </p>
          <p className="font-quantico tablet:text-lg desktop:text-xl largeDesktop:text-2xl tablet:pl-2 break-words">
            {notificationFrequency}
          </p>
        </div>
      </Link>
      <div className="hidden tablet:flex justify-between items-center w-full">
        <Trash
          className="hover:cursor-pointer tablet:w-[38px] tablet:h-[38px] desktop:w-[42px] desktop:h-[42px] largeDesktop:w-[46px] largeDesktop:h-[46px]"
          onClick={handleDeleteClick}
          color="#FF0000"
          weight="light"
        />
        <Link
          href={`/medications/edit/${medication._id}`}
          className="hover:cursor-pointer"
        >
          <PencilSimple
            className="hover:cursor-pointer tablet:w-[38px] tablet:h-[38px] desktop:w-[42px] desktop:h-[42px] largeDesktop:w-[46px] largeDesktop:h-[46px]"
            weight="light"
          />
        </Link>
      </div>
    </div>
  );
}

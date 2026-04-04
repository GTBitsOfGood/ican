import React, { useMemo } from "react";
import { Trash, PencilSimple } from "@phosphor-icons/react";
import { Medication } from "@/db/models/medication";
import { WithId } from "@/types/models";
import { formatDoseTime } from "@/utils/time";
import { getNextDosePhrase as calculateNextDosePhrase } from "@/lib/medicationDoseCalculator";
import { useSettings } from "@/components/hooks/useSettings";
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
  const { data: settings } = useSettings();
  const use24HourTime =
    settings?.notificationPreferences?.use24HourTime ?? false;

  const nextDosePhrase = useMemo(() => {
    const result = calculateNextDosePhrase(medication);

    if (medication.doseTimes?.length && medication.includeTimes) {
      return `${result.phrase}, ${formatDoseTime(medication.doseTimes[0], use24HourTime)}`;
    }

    return result.phrase;
  }, [medication, use24HourTime]);

  const notificationFrequency =
    medication.notificationFrequency === "Every Dose"
      ? "Every Dose"
      : "Day of Dose";

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
    <div className="w-full bg-white text-black px-5 py-5 rounded-none border-r-4 border-b-4 border-[#7E82BE] flex flex-col gap-5">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-3">
          {getMedicationIcon("w-6 h-6")}
          <h1 className="font-quantico uppercase text-3xl tracking-wide">
            {medication.customMedicationId}
          </h1>
        </div>
      </div>

      <div className="flex flex-col">
        <p className="font-quantico text-[#8F8F8F] text-sm">Next Dose</p>
        <p className="font-quantico font-bold text-xl">{nextDosePhrase}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {medication.dosageAmount && (
          <div className="bg-[#5A5FB2] text-white font-quantico px-4 py-2 text-sm rounded-lg">
            {medication.dosageAmount}
          </div>
        )}

        <div className="bg-[#D9DBF6] text-black font-quantico px-4 py-2 text-sm rounded-lg">
          <span className="font-bold">Notify :</span> {notificationFrequency}
        </div>
      </div>

      <div className="w-full border-t border-[#CFCFCF]" />

      <div className="flex items-center justify-between w-full">
        <button
          onClick={handleDeleteClick}
          className="flex items-center gap-2 font-quantico text-lg"
        >
          <Trash className="w-6 h-6 text-[#FF3B30]" weight="light" />
          Delete
        </button>

        <Link
          href={`/medications/edit/${medication._id}`}
          className="bg-[#A8CD4A] border-2 border-black px-6 py-1 flex items-center gap-2"
        >
          <PencilSimple className="w-5 h-5" weight="light" />
          <span className="font-quantico font-bold text-2xl text-black">
            Edit
          </span>
        </Link>
      </div>
    </div>
  );
}

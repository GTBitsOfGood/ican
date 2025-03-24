import ModalButton from "@/components/ui/modals/modalButton";
import { Dispatch, SetStateAction } from "react";
import { MedicationInfo, Time12Hour } from "@/types/medication";
import SectionValidator from "./sectionValidator";

interface SectionSelectorProps {
  modalType: "Edit" | "Add";
  currentSection: number;
  sectionSize: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
  timesIn12Hour: Time12Hour[];
  setTimesIn12Hour: Dispatch<SetStateAction<Time12Hour[]>>;
  setError: Dispatch<SetStateAction<string>>;
  onSubmit: (medicationInfo: MedicationInfo) => void;
}

export default function SectionSelector({
  modalType,
  currentSection,
  setCurrentSection,
  sectionSize,
  info,
  setInfo,
  timesIn12Hour,
  setTimesIn12Hour,
  setError,
  onSubmit,
}: SectionSelectorProps) {
  const backAction = () => {
    setError("");
    setCurrentSection((prev) => Math.max(0, prev - 1));
  };

  const nextAction = () => {
    setError("");
    const { error, newInfo, newTime } = SectionValidator({
      info,
      currentSection,
      timesIn12Hour,
    });
    if (error) {
      setError(error);
      return;
    }
    if (newInfo) {
      setInfo(newInfo);
    }
    if (newTime) {
      setTimesIn12Hour(newTime);
    }

    if (currentSection == sectionSize - 1) {
      onSubmit(info);
    } else if (modalType == "Edit" && currentSection != 3) {
      setCurrentSection(6);
    } else {
      setCurrentSection((prev) => Math.min(sectionSize - 1, prev + 1));
    }
  };

  return (
    <div className="grid grid-cols-3">
      <ModalButton
        className={`max-w-max justify-self-start`}
        action={backAction}
        disabled={
          currentSection <= 0 || (modalType == "Edit" && currentSection != 4)
        }
        type={
          modalType == "Edit" && currentSection == sectionSize - 1
            ? "danger"
            : "default"
        }
      >
        {modalType == "Edit" && currentSection == sectionSize - 1
          ? "Cancel"
          : "Back"}
      </ModalButton>
      <div className="flex justify-center items-center gap-2 smallTablet:gap-4">
        {Array.from({ length: sectionSize }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 smallTablet:w-3 tablet:w-4 smallTablet:h-3 flex-shrink-0 tablet:h-4 rounded-full transition ${
              index === currentSection ? "bg-white" : "bg-icanBlue-100"
            }`}
          />
        ))}
      </div>
      <ModalButton
        className="max-w-max justify-self-end"
        action={nextAction}
        type="success"
      >
        {currentSection == sectionSize - 1
          ? modalType == "Edit"
            ? "Save"
            : "Create"
          : modalType == "Edit" && currentSection == 3
            ? "Next"
            : "Confirm"}
      </ModalButton>
    </div>
  );
}

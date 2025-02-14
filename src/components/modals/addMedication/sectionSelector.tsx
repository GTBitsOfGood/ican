import ModalButton from "@/components/ui/modals/modalButton";
import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "./addMedicationInfo";
import SectionValidator from "./sectionValidator";

interface SectionSelectorProps {
  currentSection: number;
  sectionSize: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
  setError: Dispatch<SetStateAction<string>>;
}

export default function SectionSelector({
  currentSection,
  setCurrentSection,
  sectionSize,
  info,
  setInfo,
  setError,
}: SectionSelectorProps) {
  const backAction = () => setCurrentSection((prev) => Math.max(0, prev - 1));
  const nextAction = () => {
    setError("");
    const { error, newInfo } = SectionValidator({ info, currentSection });
    if (error) {
      setError(error);
      return;
    }
    if (newInfo) {
      setInfo(newInfo);
    }

    if (currentSection == sectionSize - 1) {
      // confirm action
    } else {
      setCurrentSection((prev) => Math.min(sectionSize - 1, prev + 1));
    }
  };

  return (
    <div className="grid grid-cols-3">
      <ModalButton
        className="max-w-max justify-self-start"
        action={backAction}
        disabled={currentSection <= 0}
      >
        Back
      </ModalButton>
      <div className="flex justify-center items-center gap-4">
        {Array.from({ length: sectionSize }).map((_, index) => (
          <div
            key={index}
            className={`w-4 h-4 rounded-full transition ${
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
        {currentSection == sectionSize - 1 ? "Confirm" : "Next"}
      </ModalButton>
    </div>
  );
}

import ModalButton from "@/components/ui/modals/modalButton";
import { Dispatch, SetStateAction } from "react";
import { MedicationInfo, Time12Hour } from "@/types/medication";
import SectionValidator from "./sectionValidator";
import { useRouter } from "next/router";

interface SectionSelectorProps {
  modalType: "Edit" | "Add";
  currentSection: number;
  sectionSize: number;
  setCurrentSection: Dispatch<SetStateAction<number>>;
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
  spareInfo: MedicationInfo;
  setSpareInfo: Dispatch<SetStateAction<MedicationInfo>>;
  timesIn12Hour: Time12Hour[];
  setTimesIn12Hour: Dispatch<SetStateAction<Time12Hour[]>>;
  spareTimesIn12Hour: Time12Hour[];
  setSpareTimesIn12Hour: Dispatch<SetStateAction<Time12Hour[]>>;
  setError: Dispatch<SetStateAction<string>>;
  onSubmit: (medicationInfo: MedicationInfo, e?: React.FormEvent) => void;
}

export default function SectionSelector({
  modalType,
  currentSection,
  setCurrentSection,
  sectionSize,
  info,
  setInfo,
  spareInfo,
  setSpareInfo,
  timesIn12Hour,
  setTimesIn12Hour,
  spareTimesIn12Hour,
  setSpareTimesIn12Hour,
  setError,
  onSubmit,
}: SectionSelectorProps) {
  const router = useRouter();

  const backAction = () => {
    setError("");
    if (modalType == "Add" || (modalType == "Edit" && currentSection == 4)) {
      setCurrentSection((prev) => Math.max(0, prev - 1));
    } else {
      if (currentSection == sectionSize - 1) {
        router.push("/");
      }
      setInfo(spareInfo);
      if (currentSection == 3) {
        setTimesIn12Hour(spareTimesIn12Hour);
      }
      setCurrentSection(6);
    }
  };

  const nextAction = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      onSubmit(info, e);
    } else if (modalType == "Edit" && currentSection != 3) {
      setSpareInfo({ ...newInfo, ...info });
      if (newTime) {
        setSpareTimesIn12Hour(newTime);
      }
      setCurrentSection(6);
    } else {
      setCurrentSection((prev) => Math.min(sectionSize - 1, prev + 1));
    }
  };

  return (
    <div
      className={`w-full grid ${modalType === "Add" ? "grid-cols-3" : "grid-cols-2"}`}
    >
      <ModalButton
        className={`max-w-max justify-self-start`}
        action={backAction}
        disabled={currentSection <= 0 && modalType == "Add"}
        type={
          modalType === "Edit" && currentSection === sectionSize - 1
            ? "danger"
            : "default"
        }
      >
        {modalType === "Edit" && currentSection === sectionSize - 1
          ? "Cancel"
          : modalType === "Edit" && currentSection === 4
            ? "Back to Dosage"
            : modalType === "Edit"
              ? "Back to Review"
              : "Back"}
      </ModalButton>
      {modalType == "Add" && (
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
      )}
      <ModalButton
        className="max-w-max justify-self-end"
        action={(e) => nextAction(e)}
        type="success"
      >
        {currentSection === sectionSize - 1
          ? modalType === "Edit"
            ? "Update"
            : "Create"
          : modalType === "Add"
            ? "Next"
            : currentSection === 3
              ? "Proceed"
              : "Save Changes"}
      </ModalButton>
    </div>
  );
}

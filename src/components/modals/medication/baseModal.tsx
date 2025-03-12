import { MedicationModalInfo } from "./medicationModalInfo";
import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import SectionSelector from "@/components/modals/medication/sectionSelector";
import GeneralSection from "./sections/generalSection";
import DosageAmountSection from "./sections/dosageAmountSection";
import RepetitionSection from "./sections/repetitionSection";
import DosageNotificationSection from "./sections/dosageNotificationSection";
import TimeSection from "./sections/timeSection";
import NotesSection from "./sections/notesSection";
import ReviewSection from "./sections/reviewSection";
import { UnauthorizedError } from "@/types/exceptions";
import { useState } from "react";

interface MedicationBaseModalProps {
  modalType: "Edit" | "Add";
  onSubmit: (medicationInfo: MedicationModalInfo) => void;
  initialInfo: MedicationModalInfo;
}

const modalTypeToSection = {
  Edit: 6,
  Add: 0,
};

export default function MedicationBaseModal({
  modalType,
  onSubmit,
  initialInfo,
}: MedicationBaseModalProps) {
  const [addMedicationInfo, setAddMedicationInfo] =
    useState<MedicationModalInfo>(initialInfo);
  const [currentSection, setCurrentSection] = useState<number>(
    modalTypeToSection[modalType],
  );
  const [error, setError] = useState<string>("");

  const sections = [
    <GeneralSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={0}
    />,
    <DosageAmountSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={1}
    />,
    <RepetitionSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={2}
    />,
    <DosageNotificationSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={3}
    />,
    <TimeSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={4}
    />,
    <NotesSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={5}
    />,
    <ReviewSection
      info={addMedicationInfo}
      setCurrentSection={setCurrentSection}
      key={6}
    />,
  ];

  const submitHandler = async (medicationInfo: MedicationModalInfo) => {
    try {
      await onSubmit(medicationInfo);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(`Failed to add medication: ${error.message}`);
      } else {
        setError("An unexpected error occurred while adding the medication");
      }
    }
  };

  return (
    <ModalBackground>
      <ModalContainer
        className={`flex flex-col ${currentSection == sections.length - 1 ? "w-[1400px]" : "w-[790px]"} h-[700px] bg-icanBlue-200`}
        title="Add New Medication"
      >
        {error && (
          <div className="mt-4 h-12 w-full px-4 bg-iCAN-error/90 flex justify-start items-center text-xl">
            {error}
          </div>
        )}
        <div className="flex-grow mt-8 px-4">{sections[currentSection]}</div>
        <SectionSelector
          modalType={modalType}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionSize={sections.length}
          info={addMedicationInfo}
          setInfo={setAddMedicationInfo}
          setError={setError}
          onSubmit={submitHandler}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import { Dispatch, SetStateAction, useState } from "react";
import SectionSelector from "./sectionSelector";
import RepetitionSection from "./sections/repetitionSection";
import TimeSection from "./sections/timeSection";
import ReviewSection from "./sections/reviewSection";
import {
  AddMedicationInfo,
  initialAddMedicationInfo,
} from "./addMedicationInfo";
import GeneralSection from "./sections/generalSection";
import DosageNotificationSection from "./sections/dosageNotificationSection";
import DosageAmountSection from "./sections/dosageAmountSection";
import NotesSection from "./sections/notesSection";

interface addMedicationModalProps {
  setAddMedicationVisibility: Dispatch<SetStateAction<boolean>>;
}

export default function AddMedicationModal({
  setAddMedicationVisibility,
}: addMedicationModalProps) {
  const [addMedicationInfo, setAddMedicationInfo] = useState<AddMedicationInfo>(
    initialAddMedicationInfo,
  );
  const [currentSection, setCurrentSection] = useState<number>(0);
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
      setInfo={setAddMedicationInfo}
      key={6}
    />,
  ];

  return (
    <ModalBackground>
      <ModalContainer
        className="flex flex-col w-[790px] h-[700px] bg-icanBlue-200"
        title="Add New Medication"
        setVisibility={setAddMedicationVisibility}
      >
        {error && (
          <div className="mt-4 h-12 w-full px-4 bg-iCAN-error/90 flex justify-start items-center text-xl">
            {error}
          </div>
        )}
        <div className="flex-grow mt-8 px-4">{sections[currentSection]}</div>
        <SectionSelector
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionSize={sections.length}
          info={addMedicationInfo}
          setInfo={setAddMedicationInfo}
          setError={setError}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

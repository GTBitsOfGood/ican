import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import { Dispatch, SetStateAction, useState } from "react";
import SectionSelector from "./sectionSelector";
import RepetitionSection from "./sections/repetitionSection";
import DosageSection from "./sections/dosageSection";
import TimeSection from "./sections/timeSection";
import ReviewSection from "./sections/reviewSection";
import {
  AddMedicationInfo,
  initialAddMedicationInfo,
} from "./addMedicationInfo";
import GeneralSection from "./sections/generalSection";

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

  const sections = [
    <GeneralSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={0}
    />,
    <RepetitionSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={1}
    />,
    <DosageSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={2}
    />,
    <TimeSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={3}
    />,
    <ReviewSection
      info={addMedicationInfo}
      setInfo={setAddMedicationInfo}
      key={4}
    />,
  ];

  return (
    <ModalBackground>
      <ModalContainer
        className="flex flex-col w-[790px] h-[650px] bg-icanBlue-200"
        title="Add New Medication"
        setVisibility={setAddMedicationVisibility}
      >
        <div className="flex-grow mt-8 px-4">{sections[currentSection]}</div>
        <SectionSelector
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionSize={sections.length}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

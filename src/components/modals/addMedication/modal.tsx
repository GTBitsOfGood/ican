import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import { Dispatch, SetStateAction, useState } from "react";
import SectionSelector from "./sectionSelector";
import InfoSection from "./sections/infoSection";
import FrequencySection from "./sections/frequencySection";
import DosageSection from "./sections/dosageSection";
import TimeSection from "./sections/timeSection";
import ReviewSection from "./sections/reviewSection";

interface addMedicationModalProps {
  setAddMedicationVisibility: Dispatch<SetStateAction<boolean>>;
}

export default function AddMedicationModal({
  setAddMedicationVisibility,
}: addMedicationModalProps) {
  const [currentSection, setCurrentSection] = useState<number>(0);

  const sections = [
    <InfoSection key={0} />,
    <FrequencySection key={1} />,
    <DosageSection key={2} />,
    <TimeSection key={3} />,
    <ReviewSection key={4} />,
  ];

  return (
    <ModalBackground>
      <ModalContainer
        className="flex flex-col w-[700px] h-[700px] bg-icanBlue-200"
        title="Add New Medication"
        setVisibility={setAddMedicationVisibility}
      >
        <div className="flex-grow">{sections[currentSection]}</div>
        <SectionSelector
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionSize={sections.length}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

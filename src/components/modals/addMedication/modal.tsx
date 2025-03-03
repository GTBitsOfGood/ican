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
import { medicationService } from "@/http/medicationService";
import { useUser } from "@/components/UserContext";
import { parseAddMedication } from "@/utils/parseAddMedition";

interface addMedicationModalProps {
  setAddMedicationVisibility: Dispatch<SetStateAction<boolean>>;
}

export default function AddMedicationModal({
  setAddMedicationVisibility,
}: addMedicationModalProps) {
  const { userId } = useUser();

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
      setCurrentSection={setCurrentSection}
      key={6}
    />,
  ];

  const handleSubmitMedication = async (
    addMedicationInfo: AddMedicationInfo,
  ) => {
    if (!userId) {
      setError("User ID is missing. Please make sure you're logged in.");
      return;
    }
    try {
      const parsedMedicationInfo = parseAddMedication(addMedicationInfo);
      await medicationService.createMedication(
        userId as string,
        parsedMedicationInfo,
      );
    } catch (error) {
      if (error instanceof Error) {
        setError(`Failed to add medication: ${error.message}`);
      } else {
        setError("An unexpected error occurred while adding the medication");
      }
      console.log(error);
    }
  };

  return (
    <ModalBackground>
      <ModalContainer
        className={`flex flex-col ${currentSection == sections.length - 1 ? "w-[1400px]" : "w-[790px]"} h-[700px] bg-icanBlue-200`}
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
          onSubmit={handleSubmitMedication}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

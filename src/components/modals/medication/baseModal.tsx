import { MedicationInfo, Time12Hour } from "@/types/medication";
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
import { convertTo12Hour } from "@/utils/time";
import { WithOptionalId } from "@/types/models";

interface MedicationBaseModalProps {
  modalType: "Edit" | "Add";
  onSubmit: (medicationInfo: WithOptionalId<MedicationInfo>) => void;
  initialInfo: WithOptionalId<MedicationInfo>;
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
  const [medicationInfo, setMedicationInfo] =
    useState<WithOptionalId<MedicationInfo>>(initialInfo);
  const [spareInfo, setSpareInfo] =
    useState<WithOptionalId<MedicationInfo>>(initialInfo);
  const [currentSection, setCurrentSection] = useState<number>(
    modalTypeToSection[modalType],
  );

  const [timesIn12Hour, setTimesIn12Hour] = useState<Time12Hour[]>(
    convertTo12Hour(initialInfo.doseTimes),
  );
  const [spareTimesIn12Hour, setSpareTimesIn12Hour] = useState<Time12Hour[]>(
    convertTo12Hour(initialInfo.doseTimes),
  );

  const [error, setError] = useState<string>("");

  const sections = [
    <GeneralSection
      info={medicationInfo}
      setInfo={setMedicationInfo}
      key={0}
    />,
    <DosageAmountSection
      info={medicationInfo}
      setInfo={setMedicationInfo}
      key={1}
    />,
    <RepetitionSection
      info={medicationInfo}
      setInfo={setMedicationInfo}
      key={2}
    />,
    <DosageNotificationSection
      info={medicationInfo}
      setInfo={setMedicationInfo}
      key={3}
    />,
    <TimeSection
      info={medicationInfo}
      setInfo={setMedicationInfo}
      timesIn12Hour={timesIn12Hour}
      setTimesIn12Hour={setTimesIn12Hour}
      key={4}
    />,
    <NotesSection info={medicationInfo} setInfo={setMedicationInfo} key={5} />,
    <ReviewSection
      info={medicationInfo}
      timesIn12Hour={timesIn12Hour}
      setCurrentSection={setCurrentSection}
      key={6}
    />,
  ];

  const submitHandler = async (
    medicationInfo: MedicationInfo,
    e?: React.FormEvent,
  ) => {
    if (e) e.preventDefault();
    try {
      await onSubmit(medicationInfo);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        setError(error.message);
      } else if (error instanceof Error) {
        setError(`Failed ${modalType}: ${error.message}`);
      } else {
        setError("An unexpected error occurred while adding the medication");
      }
    }
  };

  return (
    <ModalBackground>
      <ModalContainer
        className={`flex flex-col  w-full text-white ${currentSection == sections.length - 1 ? "tablet:w-[790px] extraLargeDesktop:w-[1400px]" : "tablet:w-[790px]"} p-8 tablet:max-w-[90vw] max-h-[90vh] h-[700px] bg-icanBlue-200`}
        title={modalType == "Add" ? "Add New Medication" : "Edit Medication"}
        back="/medications"
      >
        {error && (
          <div className="mt-4 h-10 tablet:h-12 w-full px-3 tablet:px-4 bg-iCAN-error/90 flex justify-start items-center text-lg tablet:text-xl">
            {error}
          </div>
        )}
        <div
          className={`flex-grow mt-8 mb-8 px-4 ${currentSection === 4 ? "" : "scrollbar-custom overflow-y-auto"}`}
        >
          {sections[currentSection]}
        </div>
        <SectionSelector
          modalType={modalType}
          currentSection={currentSection}
          setCurrentSection={setCurrentSection}
          sectionSize={sections.length}
          info={medicationInfo}
          setInfo={setMedicationInfo}
          spareInfo={spareInfo}
          setSpareInfo={setSpareInfo}
          timesIn12Hour={timesIn12Hour}
          setTimesIn12Hour={setTimesIn12Hour}
          spareTimesIn12Hour={spareTimesIn12Hour}
          setSpareTimesIn12Hour={setSpareTimesIn12Hour}
          setError={setError}
          onSubmit={submitHandler}
        />
      </ModalContainer>
    </ModalBackground>
  );
}

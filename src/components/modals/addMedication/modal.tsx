import ModalBackground from "../modalBackground";
import ModalContainer from "../modalContainer";
import { Dispatch, SetStateAction } from "react";

interface addMedicationModalProps {
  setAddMedicationVisibility: Dispatch<SetStateAction<boolean>>;
}

export default function AddMedicationModal({
  setAddMedicationVisibility,
}: addMedicationModalProps) {
  return (
    <ModalBackground>
      <ModalContainer
        className="w-[700px] h-[700px] bg-icanBlue-200"
        title="Add New Medication"
        setVisibility={setAddMedicationVisibility}
      >
        <div></div>
      </ModalContainer>
    </ModalBackground>
  );
}

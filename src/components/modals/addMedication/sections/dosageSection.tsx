import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";

interface DosageSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function DosageSection({}: DosageSectionProps) {
  return <div>Dosage Section</div>;
}

import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";

interface TimeSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function TimeSection({}: TimeSectionProps) {
  return <div>Time Section</div>;
}

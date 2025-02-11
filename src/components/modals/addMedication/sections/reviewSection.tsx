import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";

interface ReviewSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function ReviewSection({}: ReviewSectionProps) {
  return <div>Review Section</div>;
}

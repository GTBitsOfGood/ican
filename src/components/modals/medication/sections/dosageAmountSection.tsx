import { Dispatch, SetStateAction } from "react";
import { MedicationModalInfo } from "../medicationModalInfo";
import InputBox from "@/components/ui/form/inputBox";
import Label from "@/components/ui/form/label";

interface DosageAmountSectionProps {
  info: MedicationModalInfo;
  setInfo: Dispatch<SetStateAction<MedicationModalInfo>>;
}

export default function DosageAmountSection({
  info,
  setInfo,
}: DosageAmountSectionProps) {
  return (
    <div>
      <Label>Dosage</Label>
      <InputBox
        maxLength={50}
        value={info.dosage.amount || ""}
        onChange={(newValue: string) =>
          setInfo((prev) => {
            const temp = { ...prev };
            temp.dosage.amount = newValue;
            return temp;
          })
        }
        placeHolder="Ex. 200 mL, 2 pills, 300 mg, etc"
        className="w-full mt-4 p-6 text-2xl !text-left !font-normal !normal-case"
      />
    </div>
  );
}

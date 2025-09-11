import { Dispatch, SetStateAction } from "react";
import { MedicationInfo } from "@/types/medication";
import InputBox from "@/components/ui/form/inputBox";
import SpecialLabel from "@/components/ui/form/specialLabel";

interface DosageAmountSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
}

export default function DosageAmountSection({
  info,
  setInfo,
}: DosageAmountSectionProps) {
  return (
    <div>
      <SpecialLabel type="required">Dosage</SpecialLabel>
      <InputBox
        maxLength={50}
        value={info.dosageAmount || ""}
        onChange={(newValue: string) =>
          setInfo((prev) => {
            const temp = { ...prev };
            temp.dosageAmount = newValue;
            return temp;
          })
        }
        placeHolder="Ex. 200 mL, 2 pills, 300 mg, etc"
        className="w-full mt-4 p-3 tablet:p-6 text-lg tablet:text-2xl !text-left !font-normal !normal-case"
      />
      <div className="flex justify-between items-center">
        <p
          className={
            "text-lg opacity-50" +
            ((info.dosageAmount?.length || 0) == 50 ? "" : " invisible")
          }
        >
          50 Character limit reached
        </p>
        <p className="text-lg mt-2">{info.dosageAmount?.length || 0}/50</p>
      </div>
    </div>
  );
}

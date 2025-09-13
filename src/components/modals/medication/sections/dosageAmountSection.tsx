import { Dispatch, SetStateAction } from "react";
import { MedicationInfo } from "@/types/medication";
import InputBox from "@/components/ui/form/inputBox";
import FormLabel from "@/components/ui/form/formLabel";

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
      <FormLabel type="required">Dosage</FormLabel>
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
        {(info.dosageAmount?.length || 0) === 50 ? (
          <p className="text-lg opacity-50">50 Character limit reached</p>
        ) : (
          <p></p> // empty <p> tag is so that the "xx/50" text stays right aligned
        )}
        <p className="text-lg mt-2">{info.dosageAmount?.length || 0}/50</p>
      </div>
    </div>
  );
}

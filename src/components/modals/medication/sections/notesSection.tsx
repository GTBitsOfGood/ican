import { MedicationInfo } from "@/types/medication";
import TextBox from "@/components/ui/form/textBox";
import { Dispatch, SetStateAction } from "react";
import SpecialLabel from "@/components/ui/form/specialLabel";

interface NotesSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
}

export default function NotesSection({ info, setInfo }: NotesSectionProps) {
  return (
    <div>
      <SpecialLabel type="optional">General Notes</SpecialLabel>
      <TextBox
        value={info.notes}
        onChange={(newValue) =>
          setInfo((prev) => {
            const temp = { ...prev };
            temp.notes = newValue;
            return temp;
          })
        }
        placeHolder="Ex. Take medicine with food/water"
        className="w-full mt-4 p-3 tablet:p-6 text-lg tablet:text-2xl"
      />
    </div>
  );
}

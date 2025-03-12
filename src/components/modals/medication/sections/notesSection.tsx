import { MedicationModalInfo } from "@/components/modals/medication/medicationModalInfo";
import Label from "@/components/ui/form/label";
import TextBox from "@/components/ui/form/textBox";
import { Dispatch, SetStateAction } from "react";

interface NotesSectionProps {
  info: MedicationModalInfo;
  setInfo: Dispatch<SetStateAction<MedicationModalInfo>>;
}

export default function NotesSection({ info, setInfo }: NotesSectionProps) {
  return (
    <div>
      <Label>General Notes</Label>
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
        className="w-full mt-4 p-6 text-2xl"
      />
    </div>
  );
}

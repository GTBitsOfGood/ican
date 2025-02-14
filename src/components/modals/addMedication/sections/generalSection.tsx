import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import IDInput from "@/components/modals/addMedication/idInput";
import Label from "@/components/ui/form/label";
import FormSubtitle from "@/components/ui/form/formSubtitle";
import {
  InjectionIcon,
  PillIcon,
} from "@/components/ui/modals/addMedicationIcons";

interface GeneralSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function GeneralSection({ info, setInfo }: GeneralSectionProps) {
  return (
    <div>
      <FormControl>
        <Label>Form of Medication</Label>
        <DropDown
          width={220}
          value={info.general.form}
          setValue={(newValue: string) =>
            setInfo((prev) => {
              const temp = { ...prev };
              temp.general.form =
                newValue as AddMedicationInfo["general"]["form"];
              return temp;
            })
          }
        >
          <Option value="Pill" icon={<PillIcon className="w-10 h-10" />} />
          <Option
            value="Injection"
            icon={<InjectionIcon className="w-10 h-10" />}
          />
        </DropDown>
      </FormControl>
      <Label className="mt-8">Medication ID</Label>
      <FormSubtitle>Create a medication ID of up to 5 characters</FormSubtitle>
      <IDInput
        values={
          info.general.medicationId
            ? [...info.general.medicationId.split(""), "", "", "", ""].slice(
                0,
                5,
              )
            : ["", "", "", "", ""]
        }
        setValues={(newValues: string[]) =>
          setInfo((prev) => {
            const temp = { ...prev };
            temp.general.medicationId = newValues.join("") as string;
            return temp;
          })
        }
      />
    </div>
  );
}

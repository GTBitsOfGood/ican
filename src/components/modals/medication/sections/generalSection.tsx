import { Dispatch, SetStateAction } from "react";
import { MedicationInfo } from "@/types/medication";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import IDInput from "@/components/ui/modals/idInput";
import Label from "@/components/ui/form/label";
import FormSubtitle from "@/components/ui/form/formSubtitle";
import {
  InjectionIcon,
  LiquidIcon,
  PillIcon,
} from "@/components/ui/modals/medicationIcons";

interface GeneralSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
}

export default function GeneralSection({ info, setInfo }: GeneralSectionProps) {
  return (
    <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
      <FormControl mobileColumn={true}>
        <Label>Form of Medication</Label>
        <DropDown
          width={220}
          value={info.formOfMedication || ""}
          setValue={(newValue: string) =>
            setInfo((prev) => {
              const temp = { ...prev };
              temp.formOfMedication =
                newValue as MedicationInfo["formOfMedication"];
              return temp;
            })
          }
        >
          <Option
            value="Pill"
            icon={<PillIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          />
          <Option
            value="Syrup"
            icon={<LiquidIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          />
          <Option
            value="Shot"
            icon={<InjectionIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          />
        </DropDown>
      </FormControl>
      <Label className="mt-8">Medication ID</Label>
      <FormSubtitle>Create a medication ID of up to 5 characters</FormSubtitle>
      <IDInput
        values={
          info.customMedicationId
            ? [...info.customMedicationId.split(""), "", "", "", ""].slice(0, 5)
            : ["", "", "", "", ""]
        }
        setValues={(newValues: string[]) =>
          setInfo((prev) => {
            const temp = { ...prev };
            temp.customMedicationId = newValues.join("") as string;
            return temp;
          })
        }
      />
    </div>
  );
}

import { Dispatch, SetStateAction } from "react";
import { MedicationModalInfo } from "../medicationModalInfo";
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
  info: MedicationModalInfo;
  setInfo: Dispatch<SetStateAction<MedicationModalInfo>>;
}

export default function GeneralSection({ info, setInfo }: GeneralSectionProps) {
  return (
    <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
      <FormControl mobileColumn={true}>
        <Label>Form of Medication</Label>
        <DropDown
          width={220}
          value={info.general.form}
          setValue={(newValue: string) =>
            setInfo((prev) => {
              const temp = { ...prev };
              temp.general.form =
                newValue as MedicationModalInfo["general"]["form"];
              return temp;
            })
          }
        >
          <Option
            value="tablet"
            icon={<PillIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          >
            Pill
          </Option>
          <Option
            value="liquid"
            icon={<LiquidIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          >
            Syrup
          </Option>
          <Option
            value="injection"
            icon={<InjectionIcon className="w-6 h-6 tablet:w-10 tablet:h-10" />}
          >
            Shot
          </Option>
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

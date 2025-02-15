import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import CheckBox from "@/components/ui/form/checkBox";
import InputBox from "@/components/ui/form/inputBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import Label from "@/components/ui/form/label";
import FormText from "@/components/ui/form/formText";

interface DosageNotificationSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function DosageNotificationSection({
  info,
  setInfo,
}: DosageNotificationSectionProps) {
  return (
    <div>
      <div>
        <FormControl gap={16}>
          <CheckBox
            checked={info.dosage.type == "Doses"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.type = "Doses";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosage.type != "Doses"}>Take</FormText>
          <InputBox
            disabled={info.dosage.type != "Doses"}
            maxLength={2}
            value={info.dosage.dosesPerDay?.toString() || ""}
            onChange={(newValue: string) =>
              setInfo((prev) => {
                const numericValue = Number(newValue);
                if (isNaN(numericValue)) {
                  return prev;
                }
                const temp = { ...prev };
                if (!newValue) {
                  temp.dosage.dosesPerDay = undefined;
                } else {
                  temp.dosage.dosesPerDay = Number(
                    newValue,
                  ) as AddMedicationInfo["dosage"]["dosesPerDay"];
                }
                return temp;
              })
            }
            className="w-16 h-[52px] text-4xl"
          />
          <FormText disabled={info.dosage.type != "Doses"}>
            dose(s) per day
          </FormText>
        </FormControl>
        <HorizontalRule
          ruleClassName="border-2 border-icanGreen-200"
          textClassName="text-4xl font-bold text-icanGreen-200"
        >
          Or
        </HorizontalRule>
        <FormControl gap={16}>
          <CheckBox
            checked={info.dosage.type == "Hours"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.type = "Hours";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosage.type != "Hours"}>Take every</FormText>
          <InputBox
            disabled={info.dosage.type != "Hours"}
            maxLength={2}
            value={info.dosage.hourlyInterval?.toString() || ""}
            onChange={(newValue: string) =>
              setInfo((prev) => {
                const numericValue = Number(newValue);
                if (isNaN(numericValue)) {
                  return prev;
                }
                const temp = { ...prev };
                if (!newValue) {
                  temp.dosage.hourlyInterval = undefined;
                } else {
                  temp.dosage.hourlyInterval = Number(
                    newValue,
                  ) as AddMedicationInfo["dosage"]["hourlyInterval"];
                }
                return temp;
              })
            }
            className="w-16 h-[52px] text-4xl"
          />
          <FormText disabled={info.dosage.type != "Hours"}>hours</FormText>
        </FormControl>
      </div>
      <div className="mt-8">
        <FormControl gap={16}>
          <Label>Notify me</Label>
          <DropDown
            className="uppercase"
            width={340}
            value={info.dosage.notificationFrequency}
            setValue={(newValue: string) =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.notificationFrequency =
                  newValue as AddMedicationInfo["dosage"]["notificationFrequency"];
                return temp;
              })
            }
          >
            <Option value="Once / Day of Dosage" />
            <Option value="Every Dose" />
          </DropDown>
        </FormControl>
      </div>
    </div>
  );
}

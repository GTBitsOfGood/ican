import { Dispatch, SetStateAction } from "react";
import { MedicationModalInfo } from "../medicationModalInfo";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import CheckBox from "@/components/ui/form/checkBox";
import InputBox from "@/components/ui/form/inputBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import Label from "@/components/ui/form/label";
import FormText from "@/components/ui/form/formText";

interface DosageNotificationSectionProps {
  info: MedicationModalInfo;
  setInfo: Dispatch<SetStateAction<MedicationModalInfo>>;
}

export default function DosageNotificationSection({
  info,
  setInfo,
}: DosageNotificationSectionProps) {
  return (
    <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
      <div>
        <FormControl gap={16}>
          <CheckBox
            checked={info.dosage.type == "doses"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.type = "doses";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosage.type != "doses"}>Take</FormText>
          <InputBox
            disabled={info.dosage.type != "doses"}
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
                  ) as MedicationModalInfo["dosage"]["dosesPerDay"];
                }
                return temp;
              })
            }
            className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
          />
          <FormText disabled={info.dosage.type != "doses"}>
            dose(s) per day
          </FormText>
        </FormControl>
        <HorizontalRule
          ruleClassName="border-2 border-icanGreen-200"
          textClassName="text-2xl tablet:text-4xl font-bold text-icanGreen-200"
        >
          Or
        </HorizontalRule>
        <FormControl gap={16}>
          <CheckBox
            checked={info.dosage.type == "hours"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.type = "hours";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosage.type != "hours"}>Take every</FormText>
          <InputBox
            disabled={info.dosage.type != "hours"}
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
                  ) as MedicationModalInfo["dosage"]["hourlyInterval"];
                }
                return temp;
              })
            }
            className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
          />
          <FormText disabled={info.dosage.type != "hours"}>hours</FormText>
        </FormControl>
      </div>
      <div className="mt-8">
        <FormControl gap={16} mobileColumn={true}>
          <Label>Notify me</Label>
          <DropDown
            className="uppercase"
            width={340}
            value={info.dosage.notificationFrequency}
            setValue={(newValue: string) =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosage.notificationFrequency =
                  newValue as MedicationModalInfo["dosage"]["notificationFrequency"];
                return temp;
              })
            }
          >
            <Option value="day of dose">Day of Dosage</Option>
            <Option value="every dose">Every Dose</Option>
          </DropDown>
        </FormControl>
      </div>
    </div>
  );
}

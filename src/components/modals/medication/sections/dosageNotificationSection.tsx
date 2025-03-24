import { Dispatch, SetStateAction } from "react";
import { MedicationInfo } from "@/types/medication";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import CheckBox from "@/components/ui/form/checkBox";
import InputBox from "@/components/ui/form/inputBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import Label from "@/components/ui/form/label";
import FormText from "@/components/ui/form/formText";

interface DosageNotificationSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
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
            checked={info.dosesUnit == "Doses"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosesUnit = "Doses";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosesUnit != "Doses"}>Take</FormText>
          <InputBox
            disabled={info.dosesUnit != "Doses"}
            maxLength={2}
            value={info.dosesPerDay?.toString() || ""}
            onChange={(newValue: string) =>
              setInfo((prev) => {
                const numericValue = Number(newValue);
                if (isNaN(numericValue)) {
                  return prev;
                }
                const temp = { ...prev };
                if (!newValue) {
                  temp.dosesPerDay = undefined;
                } else {
                  temp.dosesPerDay = Number(
                    newValue,
                  ) as MedicationInfo["dosesPerDay"];
                }
                return temp;
              })
            }
            className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
          />
          <FormText disabled={info.dosesUnit != "Doses"}>
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
            checked={info.dosesUnit == "Hours"}
            onChange={() =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.dosesUnit = "Hours";
                return temp;
              })
            }
          />
          <FormText disabled={info.dosesUnit != "Hours"}>Take every</FormText>
          <InputBox
            disabled={info.dosesUnit != "Hours"}
            maxLength={2}
            value={info.doseIntervalInHours?.toString() || ""}
            onChange={(newValue: string) =>
              setInfo((prev) => {
                const numericValue = Number(newValue);
                if (isNaN(numericValue)) {
                  return prev;
                }
                const temp = { ...prev };
                if (!newValue) {
                  temp.doseIntervalInHours = undefined;
                } else {
                  temp.doseIntervalInHours = Number(
                    newValue,
                  ) as MedicationInfo["doseIntervalInHours"];
                }
                return temp;
              })
            }
            className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
          />
          <FormText disabled={info.dosesUnit != "Hours"}>hours</FormText>
        </FormControl>
      </div>
      <div className="mt-8">
        <FormControl gap={16} mobileColumn={true}>
          <Label>Notify me</Label>
          <DropDown
            width={220}
            value={info.notificationFrequency || ""}
            setValue={(newValue: string) =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.notificationFrequency =
                  newValue as MedicationInfo["notificationFrequency"];
                return temp;
              })
            }
          >
            <Option value="Day Of Dose" />
            <Option value="Every Dose" />
          </DropDown>
        </FormControl>
      </div>
    </div>
  );
}

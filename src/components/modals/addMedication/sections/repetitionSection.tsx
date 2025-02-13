import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import InputBox from "@/components/ui/form/inputBox";
import WeekDaySelector from "../weekDaySelector";
import CheckBox from "@/components/ui/form/checkBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import Label from "@/components/ui/form/label";
import FormText from "@/components/ui/form/formText";

interface RepetitionSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function RepetitionSection({
  info,
  setInfo,
}: RepetitionSectionProps) {
  const numberToOrdinal: Record<number, string> = {
    1: "First",
    2: "Second",
    3: "Third",
    4: "Fourth",
  };

  const ordinalToNumber: Record<string, number> = {
    First: 1,
    Second: 2,
    Third: 3,
    Fourth: 4,
  };

  return (
    <div>
      <FormControl gap={16}>
        <Label>Repeat every</Label>
        <InputBox
          maxLength={2}
          value={info.repetition.repeatEvery?.toString() || ""}
          onChange={(newValue: string) =>
            setInfo((prev) => {
              const numericValue = Number(newValue);
              if (isNaN(numericValue)) {
                return prev;
              }
              const temp = { ...prev };
              if (!newValue) {
                temp.repetition.repeatEvery = undefined;
              } else {
                temp.repetition.repeatEvery = Number(
                  newValue,
                ) as AddMedicationInfo["repetition"]["repeatEvery"];
              }
              return temp;
            })
          }
          className="w-16 h-[52px] text-4xl"
        />
        <DropDown
          className="uppercase"
          width={180}
          value={info.repetition.type}
          setValue={(newValue: string) =>
            setInfo((prev) => {
              const temp = { ...prev };
              temp.repetition.type =
                newValue as AddMedicationInfo["repetition"]["type"];
              return temp;
            })
          }
        >
          <Option value="Day" />
          <Option value="Week" />
          <Option value="Month" />
        </DropDown>
      </FormControl>
      <div className="mt-8">
        {info.repetition.type == "Week" && <Label>Repeat on</Label>}
        {info.repetition.type == "Month" && (
          <div>
            <FormControl gap={16}>
              <CheckBox
                checked={info.repetition.monthlyRepetition == "Day"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyRepetition = "Day";
                    return temp;
                  })
                }
              />
              <FormText disabled={info.repetition.monthlyRepetition != "Day"}>
                Repeat monthly on day
              </FormText>
              <InputBox
                disabled={info.repetition.monthlyRepetition != "Day"}
                maxLength={2}
                value={info.repetition.monthlyDayOfRepetition?.toString() || ""}
                onChange={(newValue: string) =>
                  setInfo((prev) => {
                    const numericValue = Number(newValue);
                    if (isNaN(numericValue)) {
                      return prev;
                    }
                    const temp = { ...prev };
                    if (!newValue) {
                      temp.repetition.monthlyDayOfRepetition = undefined;
                    } else {
                      temp.repetition.monthlyDayOfRepetition = Number(
                        newValue,
                      ) as AddMedicationInfo["repetition"]["monthlyDayOfRepetition"];
                    }
                    return temp;
                  })
                }
                className="w-16 h-[52px] text-4xl"
              />
            </FormControl>
            <HorizontalRule
              ruleClassName="border-2 border-icanGreen-200"
              textClassName="text-4xl font-bold text-icanGreen-200"
            >
              Or
            </HorizontalRule>
            <FormControl gap={16}>
              <CheckBox
                checked={info.repetition.monthlyRepetition == "Week"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyRepetition = "Week";
                    return temp;
                  })
                }
              />
              <FormText disabled={info.repetition.monthlyRepetition != "Week"}>
                Repeat monthly on
              </FormText>
              <DropDown
                disabled={info.repetition.monthlyRepetition != "Week"}
                className="uppercase"
                width={180}
                value={
                  numberToOrdinal[info.repetition.monthlyWeekOfRepetition || 1]
                }
                setValue={(newValue: string) =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyWeekOfRepetition = ordinalToNumber[
                      newValue
                    ] as AddMedicationInfo["repetition"]["monthlyWeekOfRepetition"];
                    return temp;
                  })
                }
              >
                <Option value="First" />
                <Option value="Second" />
                <Option value="Third" />
                <Option value="Fourth" />
              </DropDown>
              <FormText disabled={info.repetition.monthlyRepetition != "Week"}>
                week
              </FormText>
            </FormControl>
          </div>
        )}
      </div>
      {info.repetition.type != "Day" && (
        <WeekDaySelector
          disabled={
            info.repetition.type == "Month" &&
            info.repetition.monthlyRepetition != "Week"
          }
          selectedDays={info.repetition.weeklyRepetition || []}
          onSelect={(newDay: number) =>
            setInfo((prev) => {
              const temp = { ...prev };
              if (temp.repetition.weeklyRepetition?.includes(newDay)) {
                temp.repetition.weeklyRepetition =
                  temp.repetition.weeklyRepetition.filter(
                    (day) => day !== newDay,
                  );
              } else {
                temp.repetition.weeklyRepetition?.push(newDay);
              }
              return temp;
            })
          }
        />
      )}
    </div>
  );
}

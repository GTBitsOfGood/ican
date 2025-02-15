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
          <Option value="Day(s)" />
          <Option value="Week(s)" />
          <Option value="Month(s)" />
        </DropDown>
      </FormControl>
      <div className="mt-8">
        {info.repetition.type == "Week(s)" && <Label>Repeat on</Label>}
        {info.repetition.type == "Month(s)" && (
          <div>
            <FormControl gap={16}>
              <CheckBox
                className="self-start"
                checked={info.repetition.monthlyRepetition == "Week"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyRepetition = "Week";
                    return temp;
                  })
                }
              />
              <div className="flex flex-col justify-start items-start gap-4">
                <FormText
                  disabled={info.repetition.monthlyRepetition != "Week"}
                >
                  Repeat monthly on the
                </FormText>
                <FormControl gap={16}>
                  <DropDown
                    disabled={info.repetition.monthlyRepetition != "Week"}
                    className="uppercase"
                    width={180}
                    value={info.repetition.monthlyWeekOfRepetition || "First"}
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repetition.monthlyWeekOfRepetition =
                          newValue as AddMedicationInfo["repetition"]["monthlyWeekOfRepetition"];
                        return temp;
                      })
                    }
                  >
                    <Option value="First" />
                    <Option value="Second" />
                    <Option value="Third" />
                    <Option value="Fourth" />
                  </DropDown>
                  <DropDown
                    disabled={info.repetition.monthlyRepetition != "Week"}
                    className="uppercase"
                    width={180}
                    value={info.repetition.monthlyWeekDayOfRepetition}
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repetition.monthlyWeekDayOfRepetition =
                          newValue as AddMedicationInfo["repetition"]["monthlyWeekDayOfRepetition"];
                        return temp;
                      })
                    }
                  >
                    <Option value="Sunday" />
                    <Option value="Monday" />
                    <Option value="Tuesday" />
                    <Option value="Wednesday" />
                    <Option value="Thursday" />
                    <Option value="Friday" />
                    <Option value="Saturday" />
                  </DropDown>
                </FormControl>
              </div>
            </FormControl>
            <HorizontalRule
              ruleClassName="border-2 border-icanGreen-200"
              textClassName="text-4xl font-bold text-icanGreen-200"
            >
              Or
            </HorizontalRule>
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
                      let valueNum = Number(newValue);
                      if (valueNum > 31) {
                        valueNum = 31;
                      } else if (valueNum < 1) {
                        valueNum = 1;
                      }
                      temp.repetition.monthlyDayOfRepetition =
                        valueNum as AddMedicationInfo["repetition"]["monthlyDayOfRepetition"];
                    }
                    return temp;
                  })
                }
                className="w-16 h-[52px] text-4xl"
              />
            </FormControl>
          </div>
        )}
      </div>
      {info.repetition.type == "Week(s)" && (
        <WeekDaySelector
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

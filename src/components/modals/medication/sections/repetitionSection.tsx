import { Dispatch, SetStateAction } from "react";
import { MedicationModalInfo } from "../medicationModalInfo";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import InputBox from "@/components/ui/form/inputBox";
import WeekDaySelector from "../../../ui/modals/weekDaySelector";
import CheckBox from "@/components/ui/form/checkBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import Label from "@/components/ui/form/label";
import FormText from "@/components/ui/form/formText";
import { DAYS_OF_WEEK } from "@/lib/consts";

interface RepetitionSectionProps {
  info: MedicationModalInfo;
  setInfo: Dispatch<SetStateAction<MedicationModalInfo>>;
}

export default function RepetitionSection({
  info,
  setInfo,
}: RepetitionSectionProps) {
  return (
    <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
      <FormControl gap={16} mobileColumn={true}>
        <Label>Repeat every</Label>
        <FormControl gap={16}>
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
                  ) as MedicationModalInfo["repetition"]["repeatEvery"];
                }
                return temp;
              })
            }
            className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
          />
          <DropDown
            className="uppercase"
            width={180}
            value={info.repetition.type}
            setValue={(newValue: string) =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.repetition.type =
                  newValue as MedicationModalInfo["repetition"]["type"];
                return temp;
              })
            }
          >
            <Option value="day">Day(s)</Option>
            <Option value="week">Week(s)</Option>
            <Option value="month">Month(s)</Option>
          </DropDown>
        </FormControl>
      </FormControl>
      <div className="mt-8">
        {info.repetition.type == "week" && <Label>Repeat on</Label>}
        {info.repetition.type == "month" && (
          <div>
            <FormControl gap={16}>
              <CheckBox
                className="self-start"
                checked={info.repetition.monthlyRepetition == "week"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyRepetition = "week";
                    return temp;
                  })
                }
              />
              <div className="flex flex-col justify-start items-start gap-4">
                <FormText
                  disabled={info.repetition.monthlyRepetition != "week"}
                >
                  Repeat monthly on the
                </FormText>
                <FormControl gap={16}>
                  <DropDown
                    disabled={info.repetition.monthlyRepetition != "week"}
                    className="uppercase"
                    width={180}
                    value={
                      info.repetition.monthlyWeekOfRepetition.toString() || "1"
                    }
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repetition.monthlyWeekOfRepetition = parseInt(
                          newValue,
                        ) as MedicationModalInfo["repetition"]["monthlyWeekOfRepetition"];
                        return temp;
                      })
                    }
                  >
                    <Option value="1">First</Option>
                    <Option value="2">Second</Option>
                    <Option value="3">Third</Option>
                    <Option value="4">Fourth</Option>
                  </DropDown>
                  <DropDown
                    disabled={info.repetition.monthlyRepetition != "week"}
                    className="uppercase"
                    width={180}
                    value={info.repetition.monthlyWeekDayOfRepetition}
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repetition.monthlyWeekDayOfRepetition =
                          newValue as MedicationModalInfo["repetition"]["monthlyWeekDayOfRepetition"];
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
              textClassName="text-2xl tablet:text-4xl font-bold text-icanGreen-200"
            >
              Or
            </HorizontalRule>
            <FormControl gap={16}>
              <CheckBox
                checked={info.repetition.monthlyRepetition == "day"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repetition.monthlyRepetition = "day";
                    return temp;
                  })
                }
              />
              <FormText disabled={info.repetition.monthlyRepetition != "day"}>
                Repeat monthly on day
              </FormText>
              <InputBox
                disabled={info.repetition.monthlyRepetition != "day"}
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
                        valueNum as MedicationModalInfo["repetition"]["monthlyDayOfRepetition"];
                    }
                    return temp;
                  })
                }
                className="w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
              />
            </FormControl>
          </div>
        )}
      </div>
      {info.repetition.type == "week" && (
        <WeekDaySelector
          selectedDays={info.repetition.weeklyRepetition || []}
          onSelect={(newDayIndex: number) =>
            setInfo((prev) => {
              const temp = { ...prev };
              const newDay = DAYS_OF_WEEK[newDayIndex];
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

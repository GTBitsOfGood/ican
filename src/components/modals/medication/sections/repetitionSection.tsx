import { Dispatch, SetStateAction } from "react";
import { MedicationInfo } from "@/types/medication";
import FormControl from "@/components/ui/form/formControl";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import InputBox from "@/components/ui/form/inputBox";
import WeekDaySelector from "../../../ui/modals/weekDaySelector";
import CheckBox from "@/components/ui/form/checkBox";
import HorizontalRule from "@/components/ui/form/horizontalRule";
import FormText from "@/components/ui/form/formText";
import { DAYS_OF_WEEK } from "@/lib/consts";
import SpecialLabel from "@/components/ui/form/specialLabel";

interface RepetitionSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
}

export default function RepetitionSection({
  info,
  setInfo,
}: RepetitionSectionProps) {
  console.log(info.repeatMonthlyOnDay);
  return (
    <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
      <FormControl gap={16} mobileColumn={true}>
        <SpecialLabel type="required">Repeat every</SpecialLabel>
        <FormControl gap={16}>
          <InputBox
            maxLength={2}
            value={info.repeatInterval?.toString() || ""}
            onChange={(newValue: string) =>
              setInfo((prev) => {
                const numericValue = Number(newValue);
                if (isNaN(numericValue)) {
                  return prev;
                }
                const temp = { ...prev };
                if (!newValue) {
                  temp.repeatInterval = undefined;
                } else {
                  temp.repeatInterval = Number(
                    newValue,
                  ) as MedicationInfo["repeatInterval"];
                }
                return temp;
              })
            }
            className={`w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl
              ${info.repeatInterval == 0 ? " border-iCAN-error" : ""}`}
          />
          <DropDown
            width={220}
            value={info.repeatUnit || ""}
            setValue={(newValue: string) =>
              setInfo((prev) => {
                const temp = { ...prev };
                temp.repeatUnit = newValue as MedicationInfo["repeatUnit"];
                return temp;
              })
            }
          >
            <Option value="Day">Day(s)</Option>
            <Option value="Week">Week(s)</Option>
            <Option value="Month">Month(s)</Option>
          </DropDown>
        </FormControl>
      </FormControl>
      <p
        className={`text-lg text-iCAN-error mt-1 ${info.repeatInterval == 0 ? "" : " invisible"}`}
      >
        Please enter a number greater than 0.
      </p>
      <div className="mt-8">
        {info.repeatUnit == "Week" && (
          <SpecialLabel type="required">Repeat on</SpecialLabel>
        )}
        {info.repeatUnit == "Month" && (
          <div>
            <FormControl gap={16}>
              <CheckBox
                className="self-start"
                checked={info.repeatMonthlyType == "Week"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repeatMonthlyType = "Week";
                    temp.repeatMonthlyOnDay = undefined;
                    return temp;
                  })
                }
              />
              <div className="flex flex-col justify-start items-start gap-4">
                <span className="flex flex-row items-center gap-0">
                  <FormText disabled={info.repeatMonthlyType != "Week"}>
                    Repeat monthly on the
                  </FormText>
                  <FormText
                    className="text-iCAN-error"
                    disabled={info.repeatMonthlyType != "Week"}
                  >
                    *
                  </FormText>
                </span>
                <FormControl gap={16} mobileColumn={true}>
                  <DropDown
                    disabled={info.repeatMonthlyType != "Week"}
                    width={220}
                    value={info.repeatMonthlyOnWeek?.toString() || ""}
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repeatMonthlyOnWeek = parseInt(
                          newValue,
                        ) as MedicationInfo["repeatMonthlyOnWeek"];
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
                    disabled={info.repeatMonthlyType != "Week"}
                    width={220}
                    value={info.repeatMonthlyOnWeekDay || ""}
                    setValue={(newValue: string) =>
                      setInfo((prev) => {
                        const temp = { ...prev };
                        temp.repeatMonthlyOnWeekDay =
                          newValue as MedicationInfo["repeatMonthlyOnWeekDay"];
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
                checked={info.repeatMonthlyType == "Day"}
                onChange={() =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.repeatMonthlyType = "Day";
                    temp.repeatMonthlyOnWeek = undefined;
                    temp.repeatMonthlyOnWeekDay = undefined;
                    return temp;
                  })
                }
              />
              <span className="flex flex-row items-center gap-0">
                <FormText disabled={info.repeatMonthlyType != "Day"}>
                  Repeat monthly on day
                </FormText>
                <FormText
                  className="text-iCAN-error"
                  disabled={info.repeatMonthlyType != "Day"}
                >
                  *
                </FormText>
              </span>
              <InputBox
                disabled={info.repeatMonthlyType != "Day"}
                maxLength={2}
                value={info.repeatMonthlyOnDay?.toString() || ""}
                onChange={(newValue: string) =>
                  setInfo((prev) => {
                    const numericValue = Number(newValue);
                    if (isNaN(numericValue)) {
                      return prev;
                    }
                    const temp = { ...prev };
                    if (!newValue) {
                      temp.repeatMonthlyOnDay = undefined;
                    } else {
                      let valueNum = Number(newValue);
                      if (valueNum > 31) {
                        valueNum = 31;
                      }
                      temp.repeatMonthlyOnDay =
                        valueNum as MedicationInfo["repeatMonthlyOnDay"];
                    }
                    return temp;
                  })
                }
                className={`w-12 tablet:w-16 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl
                  ${info.repeatMonthlyOnDay != null && info.repeatMonthlyOnDay === 0 ? "border-iCAN-error" : ""}`}
              />
            </FormControl>
          </div>
        )}
      </div>
      <p
        className={`text-lg text-iCAN-error mt-1
        ${info.repeatMonthlyOnDay != null && info.repeatMonthlyOnDay === 0 ? "" : " invisible"}`}
      >
        Please enter a number greater than 0.
      </p>
      {info.repeatUnit == "Week" && (
        <WeekDaySelector
          selectedDays={info.repeatWeeklyOn}
          onSelect={(newDayIndex: number) =>
            setInfo((prev) => {
              const temp = { ...prev };
              const newDay = DAYS_OF_WEEK[newDayIndex];
              if (temp.repeatWeeklyOn?.includes(newDay)) {
                temp.repeatWeeklyOn = temp.repeatWeeklyOn.filter(
                  (day) => day !== newDay,
                );
              } else {
                temp.repeatWeeklyOn?.push(newDay);
              }
              return temp;
            })
          }
        />
      )}
    </div>
  );
}

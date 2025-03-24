"use client";

import { Dispatch, SetStateAction } from "react";
import { MedicationInfo, Time12Hour } from "@/types/medication";
import FormControl from "@/components/ui/form/formControl";
import Label from "@/components/ui/form/label";
import InputBox from "@/components/ui/form/inputBox";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import CheckBox from "@/components/ui/form/checkBox";
import FormText from "@/components/ui/form/formText";
import FormSubtitle from "@/components/ui/form/formSubtitle";

interface TimeSectionProps {
  info: MedicationInfo;
  setInfo: Dispatch<SetStateAction<MedicationInfo>>;
  timesIn12Hour: Time12Hour[];
  setTimesIn12Hour: Dispatch<SetStateAction<Time12Hour[]>>;
}

export default function TimeSection({
  info,
  setInfo,
  timesIn12Hour,
  setTimesIn12Hour,
}: TimeSectionProps) {
  if (info.dosesUnit === "Doses") {
    return (
      <div className="flex flex-col smallTablet:items-center tablet:items-start justify-between h-full">
        <div className="flex flex-col w-full gap-6 max-h-[45vh] tablet:max-h-[35vh] pb-12 overflow-y-auto scrollbar-custom">
          {timesIn12Hour.map((time, i) => (
            <FormControl gap={16} key={i} mobileColumn={true}>
              <Label disabled={!info.includeTimes}>{`Time #${i + 1}`}</Label>
              <FormControl gap={16}>
                <InputBox
                  disabled={!info.includeTimes}
                  maxLength={5}
                  value={time.time}
                  onChange={(newValue: string) =>
                    setTimesIn12Hour((prev) => {
                      newValue = newValue.replace(/\D/g, "");
                      if (newValue.length > 4) newValue = newValue.slice(0, 4);

                      let hours: string = newValue.slice(0, 2);
                      let minutes: string = newValue.slice(2, 4);

                      if (parseInt(hours) > 12) hours = "12";
                      if (parseInt(minutes) > 59) minutes = "59";

                      const temp = prev.map((item) => ({ ...item }));
                      temp[i].time =
                        `${hours}${newValue.length >= 3 ? ":" : ""}${minutes}`;
                      return temp;
                    })
                  }
                  className="w-28 tablet:w-40 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
                />
                <DropDown
                  disabled={!info.includeTimes}
                  width={180}
                  value={time.period}
                  setValue={(newValue: string) =>
                    setTimesIn12Hour((prev) => {
                      const temp = prev.map((item) => ({ ...item }));
                      temp[i].period = newValue as Time12Hour["period"];
                      return temp;
                    })
                  }
                >
                  <Option value="AM" />
                  <Option value="PM" />
                </DropDown>
              </FormControl>
            </FormControl>
          ))}
        </div>
        <div>
          <FormControl gap={16}>
            <CheckBox
              checked={!info.includeTimes}
              onChange={() =>
                setInfo((prev) => {
                  const temp = { ...prev };
                  temp.includeTimes = !temp.includeTimes;
                  return temp;
                })
              }
            />
            <FormText disabled={info.includeTimes}>
              No Exact Dose Time Needed
            </FormText>
          </FormControl>
        </div>
      </div>
    );
  } else {
    return (
      <div className="smallTablet:max-w-max tablet:max-w-full tablet:w-full smallTablet:mx-auto tablet:mx-0">
        <FormSubtitle>
          Tell us when you want to take your first dose, and we will calculate
          the times for your next doses!
        </FormSubtitle>
        <div className="mt-8">
          <FormControl gap={16} mobileColumn={true}>
            <Label>Time #1</Label>
            <FormControl gap={16}>
              <InputBox
                maxLength={5}
                value={timesIn12Hour[0]?.time || ""}
                onChange={(newValue: string) =>
                  setTimesIn12Hour((prev) => {
                    newValue = newValue.replace(/\D/g, "").padStart(4, "0");
                    if (newValue.length > 4) newValue = newValue.slice(0, 4);

                    let hours: string = newValue.slice(0, 2);
                    let minutes: string = newValue.slice(2, 4);

                    if (parseInt(hours) > 12) hours = "12";
                    if (parseInt(minutes) > 59) minutes = "59";

                    const newTimes = [...prev];
                    newTimes[0].time = `${hours}${newValue.length >= 3 ? ":" : ""}${minutes}`;
                    return newTimes;
                  })
                }
                className="w-28 tablet:w-40 h-[40px] tablet:h-[52px] text-2xl tablet:text-4xl"
              />
              <DropDown
                width={180}
                value={timesIn12Hour[0]?.period || "AM"}
                setValue={(newValue: string) =>
                  setTimesIn12Hour((prev) => {
                    const newTimes = [...prev];
                    newTimes[0].period = newValue as Time12Hour["period"];
                    return newTimes;
                  })
                }
              >
                <Option value="AM" />
                <Option value="PM" />
              </DropDown>
            </FormControl>
          </FormControl>
        </div>
      </div>
    );
  }
}

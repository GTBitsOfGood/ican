import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import FormControl from "@/components/ui/form/formControl";
import Label from "@/components/ui/form/label";
import InputBox from "@/components/ui/form/inputBox";
import DropDown from "@/components/ui/form/dropDown";
import Option from "@/components/ui/form/option";
import CheckBox from "@/components/ui/form/checkBox";
import FormText from "@/components/ui/form/formText";
import FormSubtitle from "@/components/ui/form/formSubtitle";

interface TimeSectionProps {
  info: AddMedicationInfo;
  setInfo: Dispatch<SetStateAction<AddMedicationInfo>>;
}

export default function TimeSection({ info, setInfo }: TimeSectionProps) {
  if (info.dosage.type === "Doses") {
    return (
      <div>
        <div className="flex flex-col gap-6 max-h-[300px] overflow-y-auto scrollbar-custom">
          {info.times.map((time, i) => (
            <FormControl gap={16} key={i}>
              <Label disabled={!info.includeTimes}>{`Time #${i + 1}`}</Label>
              <InputBox
                disabled={!info.includeTimes}
                maxLength={5}
                value={time.time}
                onChange={(newValue: string) =>
                  setInfo((prev) => {
                    newValue = newValue.replace(/\D/g, "");
                    if (newValue.length > 4) newValue = newValue.slice(0, 4);

                    let hours: string = newValue.slice(0, 2);
                    let minutes: string = newValue.slice(2, 4);

                    if (parseInt(hours) > 12) hours = "12";
                    if (parseInt(minutes) > 59) minutes = "59";

                    const temp = { ...prev };
                    const newTimes = temp.times.map((t, index) =>
                      index === i
                        ? {
                            ...t,
                            time: `${hours}${newValue.length >= 3 ? ":" : ""}${minutes}`,
                          }
                        : t,
                    );
                    temp.times = newTimes;
                    return temp;
                  })
                }
                className="w-40 h-[52px] text-4xl"
              />
              <DropDown
                disabled={!info.includeTimes}
                width={180}
                value={time.period}
                setValue={(newValue: string) =>
                  setInfo((prev) => {
                    const temp = { ...prev };
                    temp.times[i].period =
                      newValue as AddMedicationInfo["times"][number]["period"];
                    return temp;
                  })
                }
              >
                <Option value="AM" />
                <Option value="PM" />
              </DropDown>
            </FormControl>
          ))}
        </div>
        <div className="mt-10">
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
      <div>
        <FormSubtitle>
          Tell us when you want to take your first dose, and we will calculate
          the times for your next doses!
        </FormSubtitle>
        <div className="mt-8">
          <FormControl gap={16}>
            <Label>Time #1</Label>
            <InputBox
              maxLength={5}
              value={info.times[0].time}
              onChange={(newValue: string) =>
                setInfo((prev) => {
                  const temp = { ...prev };
                  info.times[0].time = newValue;
                  return temp;
                })
              }
              className="w-40 h-[52px] text-4xl"
            />
            <DropDown
              width={180}
              value={info.times[0].period}
              setValue={(newValue: string) =>
                setInfo((prev) => {
                  const temp = { ...prev };
                  info.times[0].period =
                    newValue as AddMedicationInfo["times"][number]["period"];
                  return temp;
                })
              }
            >
              <Option value="AM" />
              <Option value="PM" />
            </DropDown>
          </FormControl>
        </div>
      </div>
    );
  }
}

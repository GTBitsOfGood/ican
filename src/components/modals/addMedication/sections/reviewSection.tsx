import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import InputBox from "@/components/ui/form/inputBox";
import { EditIcon } from "@/components/ui/modals/addMedicationIcons";

interface ReviewSectionProps {
  info: AddMedicationInfo;
  setCurrentSection: Dispatch<SetStateAction<number>>;
}

export default function ReviewSection({
  info,
  setCurrentSection,
}: ReviewSectionProps) {
  const ordinalToWeekDay: Record<number, string> = {
    0: "Sunday",
    1: "Monday",
    2: "Tuesday",
    3: "Wednesday",
    4: "Thursday",
    5: "Friday",
    6: "Saturday",
  };

  return (
    <div className="h-full grid grid-cols-2 gap-3">
      <div className="flex flex-col gap-8 pr-6">
        <div className="flex justify-start items-center gap-4">
          <div className="basis-[190px] text-3xl font-bold">Form</div>
          <InputBox
            readOnly={true}
            value={info.general.form}
            className="px-4 text-2xl basis-[calc(100%-251px)] h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[35px] h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(0)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="basis-[190px] text-3xl font-bold">ID</div>
          <div className="flex justify-start basis-[calc(100%-251px)] gap-2">
            {info.general.medicationId
              .padEnd(5)
              .split("")
              .map((value, i) => (
                <InputBox
                  key={i}
                  readOnly={true}
                  value={value || " "}
                  className="px-4 text-4xl w-full h-[52px]"
                />
              ))}
          </div>
          <div
            className="basis-[35px] h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(0)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="basis-[190px] text-3xl font-bold">Dosage</div>
          <InputBox
            readOnly={true}
            value={info.dosage.amount}
            className="px-4 text-2xl basis-[calc(100%-251px)] h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[35px] h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(1)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="basis-[190px] text-3xl font-bold">Repeat every</div>
          <InputBox
            readOnly={true}
            value={
              info.repetition.type == "Day(s)"
                ? `${info.repetition.repeatEvery} Day(s)`
                : info.repetition.type == "Week(s)"
                  ? `${info.repetition.repeatEvery} Week(s) On ${info.repetition.weeklyRepetition.map((dayOrdinal) => ordinalToWeekDay[dayOrdinal]).join(", ")}`
                  : info.repetition.monthlyRepetition == "Day"
                    ? `Day ${info.repetition.monthlyDayOfRepetition} Every ${info.repetition.repeatEvery} Month(s)`
                    : `${info.repetition.monthlyWeekOfRepetition} ${info.repetition.monthlyWeekDayOfRepetition} Every ${info.repetition.repeatEvery} Month(s)`
            }
            className="basis-[calc(100%-251px)] px-4 text-2xl h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[35px] h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(2)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex justify-start items-center gap-4">
          <div className="basis-[190px] text-3xl font-bold">Notify me</div>
          <InputBox
            readOnly={true}
            value={info.dosage.notificationFrequency}
            className="px-4 text-2xl basis-[calc(100%-251px)] h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[35px] h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(3)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex justify-start items-center gap-4 pr-6">
            <div className="basis-[190px] text-3xl font-bold">Notes</div>
            <InputBox
              readOnly={true}
              value={info.notes}
              className="px-4 text-2xl basis-[calc(100%-251px)] h-[52px] !text-left !font-normal !normal-case"
            />
            <div
              className="basis-[35px] h-[35px] cursor-pointer"
              onClick={() => setCurrentSection(5)}
            >
              <EditIcon className="w-full h-full" />
            </div>
          </div>
          <div className="flex justify-start items-center gap-4 pr-6">
            <div className="basis-[190px] text-3xl font-bold">Take</div>
            <InputBox
              readOnly={true}
              value={
                info.dosage.type == "Doses"
                  ? `${info.dosage.dosesPerDay} Dose(s) Per Day`
                  : `A Dose Every ${info.dosage.hourlyInterval} Hour(s)`
              }
              className="px-4 text-2xl basis-[calc(100%-251px)] h-[52px] !text-left !font-normal !normal-case"
            />
            <div
              className="basis-[35px] h-[35px] cursor-pointer"
              onClick={() => setCurrentSection(3)}
            >
              <EditIcon className="w-full h-full" />
            </div>
          </div>
          <div className="flex flex-col gap-8 max-h-[220px] overflow-y-auto scrollbar-custom pr-4">
            {info.times.map((time, i) => (
              <div className="flex justify-start items-center gap-4" key={i}>
                <div className="basis-[190px] text-3xl font-bold">{`Time #${i + 1}`}</div>
                <InputBox
                  readOnly={true}
                  value={`${time.time} ${time.period}`}
                  className="px-4 text-2xl basis-[calc(100%-263.5px)] h-[52px] !text-left !font-normal !normal-case"
                />
                <div
                  className="basis-[35px] h-[35px] cursor-pointer"
                  onClick={() => setCurrentSection(4)}
                >
                  <EditIcon className="w-full h-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

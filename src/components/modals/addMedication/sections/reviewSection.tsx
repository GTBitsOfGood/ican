import { Dispatch, SetStateAction } from "react";
import { AddMedicationInfo } from "../addMedicationInfo";
import InputBox from "@/components/ui/form/inputBox";

interface ReviewSectionProps {
  info: AddMedicationInfo;
  setCurrentSection: Dispatch<SetStateAction<number>>;
}

export default function ReviewSection({ info }: ReviewSectionProps) {
  return (
    <div className="h-full grid grid-cols-2 gap-12">
      <div className="flex flex-col gap-8">
        <div className="flex justify-start items-center gap-6">
          <div className="basis-[410px] text-4xl font-bold">Form</div>
          <InputBox
            readOnly={true}
            value={info.general.form}
            className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
          />
        </div>
        <div className="flex justify-start items-center gap-6">
          <div className="basis-[410px] text-4xl font-bold">ID</div>
          <InputBox
            readOnly={true}
            value={info.general.medicationId}
            className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
          />
        </div>
        <div className="flex justify-start items-center gap-6">
          <div className="basis-[410px] text-4xl font-bold">Dosage</div>
          <InputBox
            readOnly={true}
            value={info.dosage.amount}
            className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
          />
        </div>
        <div className="flex justify-start items-center gap-6">
          <div className="basis-[410px] text-4xl font-bold">Repeat every</div>
          <InputBox
            readOnly={true}
            value={
              info.repetition.type == "Day(s)"
                ? `${info.repetition.repeatEvery} Day(s)`
                : info.repetition.type == "Week(s)"
                  ? `${info.repetition.weeklyRepetition.join(", ")}`
                  : info.repetition.monthlyRepetition == "Day"
                    ? `Month On Day ${info.repetition.monthlyDayOfRepetition}`
                    : `${info.repetition.weeklyRepetition.join(", ")} of the ${info.repetition.monthlyWeekOfRepetition} Week of every month`
            }
            className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !capitalize"
          />
        </div>
        <div className="flex justify-start items-center gap-6">
          <div className="basis-[410px] text-4xl font-bold">Notify me</div>
          <InputBox
            readOnly={true}
            value={info.dosage.notificationFrequency}
            className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
          />
        </div>
      </div>
      <div className="flex flex-col justify-between">
        <div className="flex flex-col gap-8">
          <div className="flex justify-start items-center gap-6">
            <div className="basis-[410px] text-4xl font-bold">Notes</div>
            <InputBox
              readOnly={true}
              value={info.notes}
              className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
            />
          </div>
          <div className="flex justify-start items-center gap-6">
            <div className="basis-[410px] text-4xl font-bold">Take</div>
            <InputBox
              readOnly={true}
              value={
                info.dosage.type == "Doses"
                  ? `${info.dosage.dosesPerDay} Dose(s) Per Day`
                  : `A Dose Every ${info.dosage.hourlyInterval} Hour(s)`
              }
              className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
            />
          </div>
          <div className="flex flex-col gap-8 max-h-[220px] overflow-y-auto scrollbar-custom pr-6">
            {info.times.map((time, i) => (
              <div className="flex justify-start items-center gap-6" key={i}>
                <div className="basis-[410px] text-4xl font-bold">{`Time #${i + 1}`}</div>
                <InputBox
                  readOnly={true}
                  value={`${time.time} ${time.period}`}
                  className="px-4 text-2xl w-full h-[52px] !text-left !font-normal !normal-case"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

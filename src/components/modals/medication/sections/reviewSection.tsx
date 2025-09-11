import { Dispatch, SetStateAction } from "react";
import { MedicationInfo, Time12Hour } from "@/types/medication";
import InputBox from "@/components/ui/form/inputBox";
import { EditIcon } from "@/components/ui/modals/medicationIcons";

interface ReviewSectionProps {
  info: MedicationInfo;
  timesIn12Hour: Time12Hour[];
  setCurrentSection: Dispatch<SetStateAction<number>>;
}

export default function ReviewSection({
  info,
  timesIn12Hour,
  setCurrentSection,
}: ReviewSectionProps) {
  return (
    <div className="h-full grid grid-cols-1 extraLargeDesktop:grid-cols-2 gap-3">
      <div className="flex flex-col gap-4 tablet:gap-8 pr-6">
        <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4">
          <div className="basis-full tablet:basis-[130px] desktop:basis-[190px] text-xl desktop:text-3xl font-bold">
            Form<span className="text-iCAN-error">*</span>
          </div>
          <InputBox
            readOnly={true}
            value={info.formOfMedication || ""}
            className="px-4 text-lg tablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] tablet:h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(0)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4">
          <div className="basis-full tablet:basis-[130px] desktop:basis-[190px] text-xl desktop:text-3xl font-bold">
            ID<span className="text-iCAN-error">*</span>
          </div>
          <div className="flex justify-start basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] gap-2">
            {info.customMedicationId
              .padEnd(5)
              .split("")
              .map((value, i) => (
                <InputBox
                  key={i}
                  readOnly={true}
                  value={value || " "}
                  className="px-2 tablet:px-4 text-lg tablet:text-xl desktop:text-4xl w-full h-[40px] tablet:h-[52px]"
                />
              ))}
          </div>
          <div
            className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(0)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4">
          <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
            Dosage<span className="text-iCAN-error">*</span>
          </div>
          <InputBox
            readOnly={true}
            value={info.dosageAmount}
            className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(1)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4">
          <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
            Repeat every<span className="text-iCAN-error">*</span>
          </div>
          <InputBox
            readOnly={true}
            value={
              info.repeatUnit === "Day"
                ? `${info.repeatInterval} Day(s)`
                : info.repeatUnit === "Week"
                  ? `${info.repeatInterval} Week(s) On ${info.repeatWeeklyOn.join(", ")}`
                  : info.repeatUnit === "Month" &&
                      info.repeatMonthlyType === "Day"
                    ? `Day ${info.repeatMonthlyOnDay} Every ${info.repeatInterval} Month(s)`
                    : `The ${info.repeatMonthlyOnWeek} ${info.repeatMonthlyOnWeekDay} Every ${info.repeatInterval} Month(s)`
            }
            className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(2)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
        <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4">
          <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
            Notify me<span className="text-iCAN-error">*</span>
          </div>
          <InputBox
            readOnly={true}
            value={info.notificationFrequency || ""}
            className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
          />
          <div
            className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
            onClick={() => setCurrentSection(3)}
          >
            <EditIcon className="w-full h-full" />
          </div>
        </div>
      </div>
      <div className="mt-2 tablet:mt-6 extraLargeDesktop:mt-0 flex flex-col justify-between">
        <div className="flex flex-col gap-4 tablet:gap-8">
          <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4 pr-6">
            <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
              Notes
            </div>
            <InputBox
              readOnly={true}
              value={info.notes}
              className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
            />
            <div
              className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
              onClick={() => setCurrentSection(5)}
            >
              <EditIcon className="w-full h-full" />
            </div>
          </div>
          <div className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4 pr-6">
            <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
              Take<span className="text-iCAN-error">*</span>
            </div>
            <InputBox
              readOnly={true}
              value={
                info.dosesUnit === "Doses"
                  ? `${info.dosesPerDay} Dose(s) Per Day`
                  : `A Dose Every ${info.doseIntervalInHours} Hour(s)`
              }
              className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-251px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
            />
            <div
              className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
              onClick={() => setCurrentSection(3)}
            >
              <EditIcon className="w-full h-full" />
            </div>
          </div>
          <div className="flex flex-col gap-4 tablet:gap-8 extraLargeDesktop:max-h-[220px] extraLargeDesktop:overflow-y-auto scrollbar-custom pr-[22px] desktop:pr-4">
            {timesIn12Hour.map((time, i) => (
              <div
                className="flex-wrap tablet:flex-nowrap flex justify-start items-center gap-4"
                key={i}
              >
                <div className="basis-full smallTablet:basis-[130px] desktop:basis-[190px] text-lg smallTablet:text-xl desktop:text-3xl font-bold">
                  {`Dose #${i + 1}`}
                  <span className="text-iCAN-error">*</span>
                </div>
                <InputBox
                  readOnly={true}
                  value={`${time.time} ${time.period}`}
                  className="px-2 smallTablet:px-4 text-lg smallTablet:text-xl desktop:text-2xl basis-[calc(100%-36px)] smallTablet:basis-[calc(100%-41px)] tablet:basis-[calc(100%-191px)] desktop:basis-[calc(100%-263.5px)] h-[40px] smallTablet:h-[52px] !text-left !font-normal !normal-case"
                />
                <div
                  className="basis-[20px] smallTablet:basis-[25px] desktop:basis-[35px] h-[20px] smallTablet:h-[25px] desktop:h-[35px] cursor-pointer"
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

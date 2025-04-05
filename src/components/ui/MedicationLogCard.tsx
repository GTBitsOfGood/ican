import { humanizeLastTakenTime } from "@/utils/date";
import Image from "next/image";

// type ScheduledTime = {
//   time: string;
//   status: "pending" | "taken" | "missed";
// };

type MedicationLogCardProps = {
  name: string;
  dosage: string;
  notes: string;
  status: "pending" | "taken" | "missed";
  scheduledTime: string;
  // date as a string
  lastTaken: string;
  //   reapeatUnit: "day" | "week" | "month";
  //   repeatInterval: number;
};
export default function MedicationLogCard({
  name,
  dosage,
  notes,
  scheduledTime,
  status,
  lastTaken,
}: MedicationLogCardProps) {
  const handleTakeClick = () => {};
  const handleMissedDoseClick = () => {};

  const lastTakenTime = () => {
    const date = new Date(lastTaken);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    let time = `${hours}:${minutes}`;

    if (Number(hours) >= 0 && Number(hours) < 12) {
      time += " A.M.";
    } else {
      time += " P.M.";
    }

    return time;
  };

  const calculateTimeLeft = () => {
    const date = new Date();
    const scheduledDate = new Date();
    scheduledDate.setHours(Number(scheduledTime.split(":")[0]));
    scheduledDate.setMinutes(Number(scheduledTime.split(":")[1]));

    const timeDiff = scheduledDate.getTime() - date.getTime();

    if (timeDiff < 0) status = "missed";

    const hours = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    return { hours, minutes, seconds };
  };

  const generateTimeLeftFormat = () => {
    const { minutes, seconds } = calculateTimeLeft();
    let min = "";
    if (minutes < 10) min = `0${minutes}`;
    else min = String(minutes);

    let sec = "";
    if (seconds < 10) sec = `0${sec}`;
    else sec = String(seconds);

    return min + ":" + sec;
  };
  return (
    <div
      className={`p-5 flex flex-col gap-y-8 ${status === "pending" ? "bg-white" : status === "taken" ? "bg-completed-gradient" : "bg-error-gradient"}`}
    >
      <div className="flex gap-1">
        <Image src={"/icons/Pill.svg"} alt="" width={34} height={34} />
        <h1 className="font-4xl text-black font-quantico underline">{name}</h1>
      </div>
      <div className="flex flex-col gap-y-[23px]">
        <h2 className="font-semibold">
          Scheduled: <span>{scheduledTime}</span>
        </h2>
        <h2 className="font-semibold">
          Dosage: <span>{dosage}</span>
        </h2>
        <h2 className="font-semibold">
          Notes: <span>{notes}</span>
        </h2>
        {status !== "taken" && (
          <h2>Last Taken: {humanizeLastTakenTime(lastTaken)}</h2>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        {status === "pending" && calculateTimeLeft().hours > 0 && (
          <div className="flex justify-center items-center font-quantico font-bold text-center text-5xl">
            Upcoming
          </div>
        )}
        {status === "pending" &&
          calculateTimeLeft().hours < 0 &&
          calculateTimeLeft().minutes < 10 && (
            <>
              <h1 className="text-icanBlue-200 font-quantico text-4xl">
                <span className="underline ">
                  {generateTimeLeftFormat()}
                  Minutes Left to Take Dose
                </span>
              </h1>
              <button
                className="bg-icanGreen-200 border-2 border-solid border-black py-2 w-full text-black font-bold font-quantico text-4xl"
                onClick={handleTakeClick}
              >
                Take
              </button>
            </>
          )}
        {status === "missed" && (
          <button
            className="bg-deleteRed border-2 border-solid border-black py-2 w-full text-white font-bold font-quantico text-4xl"
            onClick={handleMissedDoseClick}
          >
            Missed Dose
          </button>
        )}
        {status === "taken" && (
          <>
            <h3 className="text-[32px] font-quantico text-icanBlue-200">
              Thanks for taking your medication!
            </h3>
            <h1 className="text-5xl font-quantico font-bold text-icanBlue-300">
              Taken at {lastTakenTime()}
            </h1>
          </>
        )}
      </div>
      <Image
        src={"/misc/CheckMark.svg"}
        alt=""
        width={113}
        height={95}
        className="absolute right-5 top-12"
      />
    </div>
  );
}

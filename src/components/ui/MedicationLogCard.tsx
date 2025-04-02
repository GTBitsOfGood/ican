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
  lastTaken,
}: MedicationLogCardProps) {
  return (
    <div className="p-5 flex flex-col gap-y-8">
      <div className="flex gap-1">
        <Image src={""} alt="" width={34} height={34} />
        <h1>{name}</h1>
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
        <h2>Last Taken: {humanizeLastTakenTime(lastTaken)}</h2>
      </div>
      <div className="flex flex-col gap-y-2">
        <h1 className="text-icanBlue-200"></h1>
      </div>
    </div>
  );
}

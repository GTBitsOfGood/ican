import { humanizeLastTakenTime } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";
import MissedDoseModal from "../modals/MissedDoseModal";
import LogPasswordModal from "../modals/LogPasswordModal";
import MedicationTakenModal from "../modals/TakenMedicationModal";
import SuccessMedicationModal from "../modals/SuccessMedicationLogModal";
import { standardizeTime } from "@/utils/time";

export type MedicationLogCardProps = {
  name: string;
  dosage: string;
  notes: string;
  status: "pending" | "taken" | "missed";
  time: string;
  // date as a string
  lastTaken: string;
  // must update medication once taken
  // setMedication: Dispatch<SetStateAction<>>
};
export default function MedicationLogCard({
  name,
  dosage,
  notes,
  time,
  status,
  lastTaken,
  // setMedication,
}: MedicationLogCardProps) {
  const [showMissedDoseModal, setShowMissedDoseModal] =
    useState<boolean>(false);
  const [showPasswordModal, setShowPasswordModal] = useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);
  const handleTakeClick = () => {
    togglePasswordModal();
  };
  const handleMissedDoseClick = () => {
    toggleMissedDoseModal();
  };

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
  // must update medication once taken
  // this deals with that logic
  // it should use a backend service to do this though
  const handleTakeMedicationAction = () => {
    setShowConfirmModal(false);
    setShowSuccessModal(true);
  };

  const toggleMissedDoseModal = () => {
    setShowMissedDoseModal(!showMissedDoseModal);
  };

  const togglePasswordModal = () => {
    setShowPasswordModal(!showPasswordModal);
  };

  const handlePasswordConfirmationNext = () => {
    setShowPasswordModal(false);
    setShowConfirmModal(true);
  };

  const toggleConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  // const toggleSuccessModal = () => {
  //   setShowSuccessModal(!showSuccessModal);
  // };

  const calculateTimeLeft = () => {
    const { minutes, hours, seconds } = standardizeTime(time);

    if (minutes < 0 || hours < 0 || seconds < 0) status = "missed";
    return { hours, minutes, seconds };
  };

  const generateTimeLeftFormat = () => {
    const { minutes, seconds } = calculateTimeLeft();
    const min = String(minutes);

    const sec = String(seconds);

    return min.padStart(2, "0") + ":" + sec.padStart(2, "0");
  };

  return (
    <div
      className={`p-5 flex flex-col gap-y-8 ${status === "pending" ? "bg-white" : status === "taken" ? "bg-white/95" : "bg-[#F8ABAB] bg-opacity-80"} relative shadow-medicationCardShadow w-[500px] my-5`}
    >
      {showMissedDoseModal && (
        <MissedDoseModal
          setMissedDoseVisible={toggleMissedDoseModal}
          name={name}
          time={time}
        />
      )}
      {showPasswordModal && (
        <LogPasswordModal handleNext={handlePasswordConfirmationNext} />
      )}
      {showConfirmModal && (
        <MedicationTakenModal
          name={name}
          setChangeModalVisible={toggleConfirmModal}
          handleTakenAction={handleTakeMedicationAction}
        />
      )}
      {showSuccessModal && <SuccessMedicationModal />}
      <div className="flex gap-1 items-center">
        <Image src={"/icons/Pill.svg"} alt="" width={34} height={34} />
        <h1 className="text-4xl text-black font-quantico underline">{name}</h1>
      </div>
      <div className="flex flex-col gap-y-[23px] text-3xl font-quantico">
        <h2 className="font-semibold text-black">
          Scheduled: <span>{time}</span>
        </h2>
        <h2 className="font-semibold text-black">
          Dosage: <span>{dosage}</span>
        </h2>
        <h2 className="font-semibold text-black">
          Notes: <span>{notes}</span>
        </h2>
        {status !== "taken" && (
          <h2 className="text-icanBlue-200">
            Last Taken: {humanizeLastTakenTime(lastTaken)}
          </h2>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        {status === "pending" &&
          (calculateTimeLeft().minutes >= 10 ||
            calculateTimeLeft().hours > 0) && (
            <div className="flex justify-center items-center font-quantico font-bold text-center text-5xl text-icanBlue-300">
              Upcoming
            </div>
          )}
        {status === "pending" &&
          calculateTimeLeft().hours === 0 &&
          calculateTimeLeft().minutes < 10 &&
          calculateTimeLeft().minutes >= 0 && (
            <>
              <h1 className="text-icanBlue-200 font-quantico text-4xl">
                <span className="underline ">
                  {generateTimeLeftFormat()} Minutes Left to Take Dose
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
        {(status === "missed" ||
          calculateTimeLeft().hours < 0 ||
          calculateTimeLeft().minutes < 0) && (
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
            <h1 className="text-4xl font-quantico font-bold text-icanBlue-300">
              Taken at {lastTakenTime()}
            </h1>
          </>
        )}
      </div>
      {status === "taken" && (
        <Image
          src={"/misc/CheckMark.svg"}
          alt=""
          width={113}
          height={95}
          className="absolute right-5 top-12"
        />
      )}
    </div>
  );
}

import { humanizeLastTakenTime } from "@/utils/date";
import Image from "next/image";
import { useState } from "react";
import MissedDoseModal from "../modals/MissedDoseModal";
import LogPasswordModal from "../modals/LogPasswordModal";
import MedicationTakenModal from "../modals/TakenMedicationModal";
import SuccessMedicationModal from "../modals/SuccessMedicationLogModal";
import { standardizeTime } from "@/utils/time";
import { LogType } from "@/types/log";

export default function MedicationLogCard({
  name,
  dosage,
  notes,
  scheduledDoseTime,
  canCheckIn,
  status,
  // date as a string
  lastTaken,
  // setMedication,
}: LogType) {
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
    const { minutes, hours, seconds } = standardizeTime(scheduledDoseTime);

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
      className={`p-5 flex flex-col gap-y-6 ${status === "pending" ? "bg-white" : status === "taken" ? "bg-[#E6E6E6]" : "bg-[#FEEEEE]"} relative shadow-medicationCardShadow w-[480px] my-5`}
    >
      {showMissedDoseModal && (
        <MissedDoseModal
          setMissedDoseVisible={toggleMissedDoseModal}
          name={name}
          time={scheduledDoseTime}
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
        <h1 className="text-3xl text-black font-quantico underline">{name}</h1>
      </div>
      <div className="flex flex-col gap-y-[16px] font-quantico">
        <h2 className="font-semibold text-black text-3xl">
          Scheduled: <span className="font-normal">{scheduledDoseTime}</span>
        </h2>
        <h2 className="font-semibold text-black text-3xl">
          Dosage: <span className="font-normal">{dosage}</span>
        </h2>
        <h2 className="font-semibold text-black text-3xl">
          Notes: <span className="font-normal">{notes}</span>
        </h2>
        {status !== "taken" && (
          <h2 className="text-icanBlue-200 text-3xl">
            Last Taken: {humanizeLastTakenTime(lastTaken)}
          </h2>
        )}
      </div>
      <div className="flex flex-col gap-y-2">
        {status === "pending" && !canCheckIn && (
          <div className="flex justify-center items-center font-quantico font-bold text-center text-5xl text-icanBlue-300">
            Upcoming
          </div>
        )}
        {status === "pending" && canCheckIn && (
          <>
            <h1 className="text-icanBlue-200 font-quantico text-[28px] font-bold">
              <span className="underline ">{generateTimeLeftFormat()}</span>{" "}
              Mins Left to Take Dose
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
            <h3 className="text-[26px] font-quantico text-icanBlue-200 text-center">
              Thanks for taking your medication!
            </h3>
            <h1 className="text-4xl font-quantico font-bold text-icanBlue-300 text-center">
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
      {status === "missed" && (
        <Image
          src={"/misc/CrossMark.svg"}
          alt=""
          width={113}
          height={95}
          className="absolute right-5 top-12"
        />
      )}
    </div>
  );
}

import Image from "next/image";
import { useState } from "react";
import MissedDoseModal from "../modals/MissedDoseModal";
import LogPasswordModal from "../modals/LogPasswordModal";
import MedicationTakenModal from "../modals/TakenMedicationModal";
import SuccessMedicationModal from "../modals/SuccessMedicationLogModal";
import { standardizeTime } from "@/utils/time";
import { LogType } from "@/types/log";
import { useDisclosure } from "@heroui/react";
import { useMedicationCheckIn, useMedicationLog } from "../hooks/useMedication";
import { useSettings } from "../hooks/useSettings";

export default function MedicationLogCard({
  id,
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
  const {
    isOpen: showPasswordModal,
    onOpen: openPasswordModal,
    onClose: closePasswordModal,
  } = useDisclosure(); //for managing pin modal
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const medicationCheckInMutation = useMedicationCheckIn();
  const medicationLogMutation = useMedicationLog();
  const { data: settings } = useSettings();

  const hasParentalControls = !!settings?.pin;

  const now = new Date();

  // Create a Date object for today at the scheduled time
  const scheduled = new Date();
  const { hours, minutes } = standardizeTime(scheduledDoseTime);
  scheduled.setHours(hours, minutes, 0, 0);
  const localizedScheduledTime = scheduled.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Create a Date object for today at the last taken time
  const lastTakenDate = lastTaken ? new Date(lastTaken) : null;
  const localizedLastTaken = !lastTakenDate
    ? "N/A"
    : lastTakenDate.toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
      });
  const localizedLastTakenDate = !lastTakenDate
    ? "N/A"
    : lastTakenDate.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        month: "short",
        day: "numeric",
      });

  // must update medication once taken
  // this deals with that logic
  // it should use a backend service to do this though
  const handleTakeMedicationAction = () => {
    medicationLogMutation.mutate(
      {
        medicationId: id,
        localTime: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          setShowConfirmModal(false);
          setShowSuccessModal(true);
        },
      },
    );
  };

  const handleMedicationCheckIn = () => {
    medicationCheckInMutation.mutate(
      {
        medicationId: id,
        localTime: new Date().toISOString(),
      },
      {
        onSuccess: () => {
          if (hasParentalControls) {
            openPasswordModal();
          } else {
            setShowConfirmModal(true);
          }
        },
      },
    );
  };

  const toggleMissedDoseModal = () => {
    setShowMissedDoseModal(!showMissedDoseModal);
  };

  const toggleConfirmModal = () => {
    setShowConfirmModal(!showConfirmModal);
  };

  const generateTimeLeftFormat = (): string => {
    const timeDiffMs = scheduled.getTime() - now.getTime();
    const totalSeconds = Math.floor(timeDiffMs / 1000);
    // Calculate minutes left (positive means future, negative means past)
    const leftMinutes = Math.floor(totalSeconds / 60);
    const leftSeconds = Math.abs(totalSeconds) % 60;

    if (leftMinutes < -15) {
      status = "missed";
    }

    return (
      String(Math.abs(leftMinutes)).padStart(2, "0") +
      ":" +
      String(leftSeconds).padStart(2, "0")
    );
  };

  return (
    <div
      className={`p-5 flex flex-col justify-between gap-y-4 ${status === "pending" ? "bg-white" : status === "taken" ? "bg-[#E6E6E6]" : "bg-[#FEEEEE]"} relative shadow-medicationCardShadow w-[480px] my-5`}
    >
      {showMissedDoseModal && (
        <MissedDoseModal
          setMissedDoseVisible={toggleMissedDoseModal}
          name={name}
          time={localizedScheduledTime}
        />
      )}
      {showPasswordModal && (
        <LogPasswordModal
          handleNext={() => setShowConfirmModal(true)}
          isOpen={showPasswordModal}
          onClose={closePasswordModal}
        />
      )}
      {showConfirmModal && (
        <MedicationTakenModal
          name={name}
          setChangeModalVisible={toggleConfirmModal}
          handleTakenAction={handleTakeMedicationAction}
        />
      )}
      {showSuccessModal && <SuccessMedicationModal />}
      <div className="flex flex-col gap-y-6">
        <div className="flex gap-1 items-center">
          <Image src={"/icons/Pill.svg"} alt="" width={34} height={34} />
          <h1 className="text-3xl text-black font-quantico">{name}</h1>
        </div>
        <div className="flex flex-col gap-y-[16px] font-quantico">
          <h2 className="font-semibold text-black text-3xl">
            Scheduled:{" "}
            <span className="font-normal">{localizedScheduledTime}</span>
          </h2>
          <h2 className="font-semibold text-black text-3xl">
            Dosage: <span className="font-normal">{dosage}</span>
          </h2>
          <h2 className="font-semibold text-black text-3xl">
            Notes: <span className="font-normal">{notes}</span>
          </h2>
          {status !== "taken" && (
            <h2 className="text-icanBlue-200 text-3xl">
              Last Taken: {localizedLastTakenDate}
            </h2>
          )}
        </div>
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
              onClick={handleMedicationCheckIn}
            >
              Take
            </button>
          </>
        )}
        {status === "missed" && (
          <button
            className="bg-deleteRed border-2 border-solid border-black py-2 w-full text-white font-bold font-quantico text-4xl"
            onClick={toggleMissedDoseModal}
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
              Taken at {localizedLastTaken}
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

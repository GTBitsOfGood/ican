import { useState } from "react";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useDisclosure } from "@heroui/react";
import { useMedicationCheckIn, useMedicationLog } from "../hooks/useMedication";
import { useSettings } from "../hooks/useSettings";
import { useUser } from "@/components/UserContext";
import { useTutorial } from "@/components/TutorialContext";
import { TUTORIAL_PORTIONS } from "@/constants/tutorial";
import { LogType } from "@/types/log";
import { standardizeTime } from "@/utils/time";
import MissedDoseModal from "../modals/MissedDoseModal";
import LogPasswordModal from "../modals/LogPasswordModal";
import MedicationTakenModal from "../modals/TakenMedicationModal";
import { InjectionIcon, LiquidIcon, PillIcon } from "./modals/medicationIcons";

const TUTORIAL_MEDICATION_NAME = "PRACTICE DOSE";

type MobileMedicationLogCardProps = LogType & {
  showGreenAccent?: boolean;
};

export default function MobileMedicationLogCard({
  id,
  name,
  formOfMedication,
  dosage,
  notes,
  scheduledDoseTime,
  includeTimes = true,
  canCheckIn,
  status,
  lastTaken,
  showGreenAccent = false,
}: MobileMedicationLogCardProps) {
  const router = useRouter();
  const tutorial = useTutorial();
  const { userId } = useUser();
  const { data: settings } = useSettings();
  const medicationCheckInMutation = useMedicationCheckIn();
  const medicationLogMutation = useMedicationLog();

  const isTutorialMedication = name === TUTORIAL_MEDICATION_NAME;
  const tutorialMedicationAlreadyTaken =
    tutorial.isActive &&
    isTutorialMedication &&
    (tutorial.shouldShowMedicationDrag ||
      tutorial.tutorialPortion > TUTORIAL_PORTIONS.LOG_TUTORIAL);
  const shouldUseTutorialFlow = tutorial.isActive && isTutorialMedication;
  const shouldUseReplayTutorialFlow =
    shouldUseTutorialFlow && tutorial.isReplay;
  const shouldBypassTutorialTiming =
    shouldUseTutorialFlow && !tutorialMedicationAlreadyTaken;
  const isSubmittingTutorialDose =
    shouldUseTutorialFlow &&
    (medicationCheckInMutation.isPending || medicationLogMutation.isPending);

  const [showMissedDoseModal, setShowMissedDoseModal] =
    useState<boolean>(false);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const {
    isOpen: showPasswordModal,
    onOpen: openPasswordModal,
    onClose: closePasswordModal,
  } = useDisclosure();

  const hasParentalControls = !!settings?.pin;
  const timezoneOffsetMinutes = new Date().getTimezoneOffset();
  const now = new Date();
  const effectiveStatus = tutorialMedicationAlreadyTaken ? "taken" : status;
  const effectiveCanCheckIn =
    shouldBypassTutorialTiming ||
    (!tutorialMedicationAlreadyTaken && canCheckIn);

  const scheduled = new Date();
  const { hours, minutes } = standardizeTime(scheduledDoseTime);
  scheduled.setHours(hours, minutes, 0, 0);
  const localizedScheduledTime = scheduled.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
  const displayScheduledTime = includeTimes
    ? localizedScheduledTime
    : "All Day";

  const lastTakenDate = lastTaken ? new Date(lastTaken) : null;
  const localizedLastTaken = !lastTakenDate
    ? "N/A"
    : lastTakenDate.toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      });
  const localizedLastTakenDate = !lastTakenDate
    ? "N/A"
    : lastTakenDate.toLocaleString(undefined, {
        hour: "numeric",
        minute: "numeric",
        month: "long",
        day: "numeric",
      });

  const handleTakeMedicationAction = () => {
    if (shouldUseReplayTutorialFlow) {
      setShowConfirmModal(false);
      tutorial.queueTutorialMedicationReward(formOfMedication);
      router.push("/");
      return;
    }

    const onSuccess = () => {
      setShowConfirmModal(false);
      if (shouldUseTutorialFlow) {
        tutorial.queueTutorialMedicationReward(formOfMedication);
        router.push("/");
        return;
      }

      router.push({
        pathname: "/",
        query: {
          medicationReward: "true",
          medicationType: formOfMedication,
        },
      });
    };

    medicationLogMutation.mutate(
      {
        userId: userId!,
        medicationId: id,
        localTime: new Date().toISOString(),
        timezoneOffsetMinutes,
      },
      {
        onSuccess,
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : "Failed to log the practice dose.",
          );
        },
      },
    );
  };

  const handleMedicationCheckIn = () => {
    if (shouldUseReplayTutorialFlow) {
      setShowConfirmModal(true);
      return;
    }

    medicationCheckInMutation.mutate(
      {
        userId: userId!,
        medicationId: id,
        localTime: new Date().toISOString(),
        timezoneOffsetMinutes,
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

  const generateTimeLeftFormat = (): string => {
    const timeDiffMs = scheduled.getTime() - now.getTime();
    const totalSeconds = Math.floor(timeDiffMs / 1000);
    const leftMinutes = Math.floor(totalSeconds / 60) + 15;
    const leftSeconds = Math.abs(totalSeconds) % 60;

    if (leftMinutes < 0) {
      status = "missed";
    }

    return `${String(leftMinutes).padStart(2, "0")}:${String(leftSeconds).padStart(2, "0")}`;
  };

  const getMedicationIcon = () => {
    switch (formOfMedication) {
      case "Syrup":
        return <LiquidIcon className="h-8 w-8" />;
      case "Shot":
        return <InjectionIcon className="h-8 w-8" />;
      case "Pill":
      default:
        return <PillIcon className="h-8 w-8" />;
    }
  };

  const cardBaseClasses =
    "relative w-[345px] overflow-hidden p-3 shadow-[3.585px_3.585px_0px_0px_rgba(125,131,178,1)]";
  const cardToneClass =
    effectiveStatus === "pending"
      ? "bg-white"
      : effectiveStatus === "taken"
        ? "bg-[#D9D9D9]"
        : "bg-[#F3D7D7]";
  const bodyLabelClass =
    effectiveStatus === "pending" ? "text-zinc-600" : "text-[#4F4F4F]";
  const bodyValueClass =
    effectiveStatus === "pending" ? "text-black" : "text-black";
  const infoClass =
    effectiveStatus === "pending" ? "text-icanBlue-200" : "text-[#3F4692]";
  const dividerClass =
    effectiveStatus === "pending" ? "bg-stone-300" : "bg-[#C8C8C8]";

  return (
    <div className={`${cardBaseClasses} ${cardToneClass}`}>
      {showMissedDoseModal && (
        <MissedDoseModal
          setMissedDoseVisible={() => setShowMissedDoseModal(false)}
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
          setChangeModalVisible={() => setShowConfirmModal(false)}
          handleTakenAction={handleTakeMedicationAction}
        />
      )}

      {showGreenAccent && (
        <div className="absolute right-[-6px] top-0 h-full w-[6px] bg-[#98D03B]" />
      )}
      {effectiveStatus === "missed" && (
        <div className="absolute right-5 top-8 text-[78px] font-bold leading-none text-[#C61E1E]">
          ×
        </div>
      )}
      {effectiveStatus === "taken" && (
        <div className="absolute right-4 top-7 text-[74px] font-bold leading-none text-[#84B11F]">
          ✓
        </div>
      )}

      <div className="relative z-10 flex flex-col gap-5 font-quantico">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {getMedicationIcon()}
            <h2 className="text-[32px] leading-none tracking-[-0.04em] text-black">
              {name}
            </h2>
          </div>

          <div className="flex flex-col gap-1">
            <div
              className={`text-sm leading-4 tracking-[-0.04em] ${bodyLabelClass}`}
            >
              Scheduled
            </div>
            <div
              className={`text-[20px] font-bold leading-5 tracking-[-0.04em] ${bodyValueClass}`}
            >
              {displayScheduledTime}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <div
              className={`text-sm leading-4 tracking-[-0.04em] ${bodyLabelClass}`}
            >
              Notes
            </div>
            <div
              className={`text-[20px] font-bold leading-5 tracking-[-0.04em] ${bodyValueClass}`}
            >
              {notes || "N/A"}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="rounded-lg bg-icanBlue-200 px-2 py-2">
              <div className="text-base leading-4 tracking-[-0.04em] text-white">
                {dosage}
              </div>
            </div>
          </div>

          {effectiveStatus !== "taken" && (
            <div className="flex flex-col gap-1">
              <div
                className={`text-sm leading-4 tracking-[-0.04em] ${infoClass}`}
              >
                Last Taken:
              </div>
              <div
                className={`text-[20px] leading-5 tracking-[-0.04em] ${infoClass}`}
              >
                {localizedLastTakenDate}
              </div>
            </div>
          )}
        </div>

        <div className={`h-px w-full ${dividerClass}`} />

        <div className="flex flex-col gap-2">
          {effectiveStatus === "pending" && effectiveCanCheckIn && (
            <>
              <div className="text-center text-2xl font-bold leading-6 text-icanBlue-200">
                {includeTimes && !shouldBypassTutorialTiming ? (
                  <>
                    <span className="underline">
                      {generateTimeLeftFormat()}
                    </span>{" "}
                    Minutes Left
                    <br />
                    to Take Dose
                  </>
                ) : (
                  "Available Now"
                )}
              </div>
              <button
                className="flex h-11 w-full items-center justify-center border-[1.4px] border-black bg-icanGreen-200 text-2xl font-bold leading-6 text-black"
                onClick={handleMedicationCheckIn}
                disabled={isSubmittingTutorialDose}
              >
                {isSubmittingTutorialDose ? "Taking..." : "Take"}
              </button>
            </>
          )}

          {effectiveStatus === "pending" && !effectiveCanCheckIn && (
            <div className="text-center text-2xl font-bold leading-6 text-icanBlue-200">
              Upcoming
            </div>
          )}

          {effectiveStatus === "taken" && (
            <>
              <div className="text-center text-[20px] leading-5 tracking-[-0.04em] text-[#4C539B]">
                Thanks for taking your medication!
              </div>
              <div className="text-center text-[24px] font-bold leading-6 tracking-[-0.04em] text-[#4C539B]">
                Taken at {localizedLastTaken}
              </div>
            </>
          )}

          {effectiveStatus === "missed" && (
            <button
              className="flex h-[45px] w-full items-center justify-center border-[1.4px] border-black bg-[#B01515] text-[24px] font-bold leading-none tracking-[-0.04em] text-white"
              onClick={() => setShowMissedDoseModal(true)}
            >
              Missed Dose
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

import { useEffect } from "react";
import {
  InjectionIcon,
  LiquidIcon,
  PillIcon,
} from "../ui/modals/medicationIcons";

interface TutorialRewardOverlayProps {
  medicationType: "Pill" | "Syrup" | "Shot";
  onDismiss: () => void;
  message?: string;
}

export default function TutorialRewardOverlay({
  medicationType,
  onDismiss,
  message = "You have gained medicine to give to your pet!",
}: TutorialRewardOverlayProps) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [medicationType, onDismiss]);

  const medicationIcon =
    medicationType === "Syrup" ? (
      <LiquidIcon className="h-[200px] w-[200px]" />
    ) : medicationType === "Shot" ? (
      <InjectionIcon className="h-[200px] w-[200px]" />
    ) : (
      <PillIcon className="h-[200px] w-[200px]" />
    );

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#292f46]/50 px-6"
      onClick={() => {}}
      role="presentation"
    >
      <div
        className="relative w-full max-w-[357px] bg-[#565DAA] px-6 py-8 text-white outline-none desktop:max-w-[840px] desktop:bg-icanBlue-200"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tutorial-reward-title"
      >
        <button
          type="button"
          onClick={onDismiss}
          className="absolute right-[2.5rem] top-[3rem] z-10 h-12 w-12 rounded-full font-pixelify text-6xl font-normal text-iCAN-Green hover:bg-white/5 active:bg-white/10"
          aria-label="Close"
        >
          <span className="relative bottom-3">x</span>
        </button>
        <div
          id="tutorial-reward-title"
          className="flex justify-center text-center font-quantico font-bold text-[32px] leading-none desktop:mobile:text-2xl desktop:tablet:text-3xl desktop:largeDesktop:text-4xl desktop:tiny:text-xl desktop:minimized:text-2xl desktop:small:text-3xl"
        >
          Medication Logged Successfully
        </div>
        <div className="mt-6 flex justify-center items-center">
          <div className="scale-[0.56] desktop:scale-100">{medicationIcon}</div>
        </div>
        <div className="mt-4 flex justify-center px-5 text-center font-mono text-[15px] font-medium leading-6 desktop:text-3xl desktop:font-quantico">
          {message}
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import { WelcomeStepType, OnboardingStep } from "@/types/onboarding";

interface WelcomeStepsProps {
  currentStep: WelcomeStepType;
  onGetStarted?: () => void;
  onChildSetup?: () => void;
  onParentSetup?: () => void;
}

export default function WelcomeSteps({
  currentStep,
  onGetStarted,
  onChildSetup,
  onParentSetup,
}: WelcomeStepsProps) {
  return (
    <div className="w-[90%] max-w-sm max-h-96 h-[50%] px-7 bg-white rounded-lg desktop:max-h-none desktop:h-auto desktop:py-16 desktop:max-w-none desktop:w-auto desktop:px-16 desktop:rounded-[64px] inline-flex flex-col justify-center items-center gap-3.5 desktop:gap-8 overflow-hidden">
      <div className="w-full h-24 desktop:h-40 relative">
        <Image
          src="/icanLogo.svg"
          alt="International Children Advisory Network Logo"
          fill
          className="object-contain"
        />
      </div>
      {currentStep === OnboardingStep.Welcome && (
        <>
          <p className="font-quantico font-bold text-black text-bold text-2xl desktop:text-4xl text-center">
            Helping families track medications with ease.
          </p>
          <button
            className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-lg desktop:text-3xl font-normal font-quantico"
            onClick={onGetStarted}
            type="button"
          >
            Get Started
          </button>
        </>
      )}
      {currentStep === OnboardingStep.Setup && (
        <>
          <p className="font-quantico font-bold text-black text-bold text-2xl desktop:text-4xl text-center">
            Who are you setting up this app for?
          </p>
          <div className="w-full gap-3.5 desktop:gap-9 flex flex-col items-center">
            <button
              className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-lg desktop:text-3xl font-normal font-quantico"
              onClick={onParentSetup}
              type="button"
            >
              For My Child!
            </button>
            <button
              className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-lg desktop:text-3xl font-normal font-quantico"
              onClick={onChildSetup}
              type="button"
            >
              For Myself!
            </button>
          </div>
        </>
      )}
    </div>
  );
}

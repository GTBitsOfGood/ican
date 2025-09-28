import Image from "next/image";

interface WelcomeStepsProps {
  currentStep: "Welcome" | "Setup";
  onGetStarted?: () => void;
  onChildSetup?: () => void;
  onSelfSetup?: () => void;
}

export default function WelcomeSteps({
  currentStep,
  onGetStarted,
  onChildSetup,
  onSelfSetup,
}: WelcomeStepsProps) {
  return (
    <div className="h-[486px] px-16 bg-white rounded-[64px] inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
      <div className="w-full h-40 relative">
        <Image
          src="/icanLogo.svg"
          alt="International Children Advisory Network Logo"
          fill
          className="object-contain"
        />
      </div>
      {currentStep === "Welcome" && (
        <>
          <p className="font-quantico font-bold text-black text-bold text-4xl text-center">
            Helping families track medications with ease.
          </p>
          <button
            className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']"
            onClick={onGetStarted}
            type="button"
          >
            Get Started
          </button>
        </>
      )}
      {currentStep === "Setup" && (
        <>
          <p className="font-quantico font-bold text-black text-bold text-4xl text-center">
            Who are you setting up this app for?
          </p>
          <div className="w-full gap-9 flex flex-col">
            <button
              className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']"
              onClick={onChildSetup}
              type="button"
            >
              For My Child!
            </button>
            <button
              className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']"
              onClick={onSelfSetup}
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

import OnboardingCard from "../shared/OnboardingCard";
import BackButton from "../../ui/BackButton";
import OnboardingActionButton from "../shared/OnboardingActionButton";
import { CompletionStepType, OnboardingStep } from "@/types/onboarding";

interface CompletionStepProps {
  currentStep: CompletionStepType;
  onBack?: () => void;
  onComplete?: () => void;
}

export default function CompletionStep({
  currentStep,
  onBack,
  onComplete,
}: CompletionStepProps) {
  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="mobile:block desktop:hidden self-start [&>a]:w-16 [&>a]:h-16 [&>a>button]:w-full [&>a>button]:h-full">
        <BackButton onClick={onBack} />
      </div>

      <OnboardingCard>
        <div className="mobile:hidden desktop:block [&>a]:w-24 [&>a]:h-24 [&>a>button]:w-full [&>a>button]:h-full">
          <BackButton onClick={onBack} />
        </div>

        <div className="w-full flex flex-col gap-2.5">
          <div>
            <p className="text-white text-4xl desktop:text-6xl font-bold font-quantico">
              {currentStep === OnboardingStep.ChooseMedication
                ? "Awesome!"
                : "All Set!"}
            </p>
          </div>
          <p className="text-stone-50 text-2xl desktop:text-5xl font-normal desktop:font-bold font-quantico">
            {currentStep === OnboardingStep.ChooseMedication
              ? "You've accepted the terms. Now let's set up your child's medications."
              : "Pass the device to your child so they can pick their character to begin the fun!"}
          </p>
        </div>

        <OnboardingActionButton
          text="I understand"
          onClick={onComplete}
          className={
            currentStep === OnboardingStep.ChoosePet
              ? "[&>button]:!w-full !justify-center"
              : ""
          }
        />
      </OnboardingCard>
    </div>
  );
}

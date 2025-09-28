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
    <OnboardingCard>
      <BackButton onClick={onBack} />

      <div className="w-full flex flex-col gap-2.5">
        <div>
          <p className="text-white text-6xl font-bold font-quantico">
            {currentStep === OnboardingStep.ChooseMedication
              ? "Awesome!"
              : "All Set!"}
          </p>
        </div>
        <p className="text-white text-5xl font-bold font-quantico">
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
  );
}

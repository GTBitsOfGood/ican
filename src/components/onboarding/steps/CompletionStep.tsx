import OnboardingCard from "../shared/OnboardingCard";
import OnboardingBackButton from "../shared/OnboardingBackButton";
import OnboardingActionButton from "../shared/OnboardingActionButton";

interface CompletionStepProps {
  currentStep: "Awesome" | "Completed";
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
      <OnboardingBackButton onClick={onBack} />

      <div className="w-full flex flex-col gap-2.5">
        <div>
          <p className="text-white text-6xl font-bold font-quantico">
            {currentStep === "Awesome" ? "Awesome!" : "All Set!"}
          </p>
        </div>
        <p className="text-white text-5xl font-bold font-quantico">
          {currentStep === "Awesome"
            ? "You've accepted the terms. Now let's set up your child's medications."
            : "Pass the device to your child so they can pick their character to begin the fun!"}
        </p>
      </div>

      <OnboardingActionButton
        text="I understand"
        onClick={onComplete}
        className={
          currentStep === "Completed"
            ? "[&>button]:!w-full !justify-center"
            : ""
        }
      />
    </OnboardingCard>
  );
}

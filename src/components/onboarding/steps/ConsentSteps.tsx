import Confirmation from "@/components/ui/form/confirmation";
import OnboardingCard from "../shared/OnboardingCard";
import OnboardingBackButton from "../shared/OnboardingBackButton";
import OnboardingHeader from "../shared/OnboardingHeader";
import OnboardingActionButton from "../shared/OnboardingActionButton";

interface ConsentStepsProps {
  currentStep: "Parent" | "Child";
  consentChecked: boolean;
  onConsentChange: (checked: boolean) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

export default function ConsentSteps({
  currentStep,
  consentChecked,
  onConsentChange,
  onBack,
  onSubmit,
}: ConsentStepsProps) {
  const isParent = currentStep === "Parent";

  return (
    <OnboardingCard>
      <OnboardingBackButton onClick={onBack} />

      <OnboardingHeader
        subtitle={isParent ? "Hey parents, don't forget your" : "Hey Kids"}
        title={isParent ? "Medical Responsibility" : "Before You Begin..."}
        description={
          isParent
            ? "Before you can add new medications, please review the terms below and confirm your agreement below."
            : "Please confirm you have your Parent's permission to use this app."
        }
      />

      <Confirmation
        text={
          isParent
            ? "I accept responsibility for logging my child's medicine"
            : "I have my parent's permission to use this. "
        }
        checked={consentChecked}
        onChange={onConsentChange}
      />

      <OnboardingActionButton
        text="I Accept"
        onClick={onSubmit}
        disabled={!consentChecked}
      />
    </OnboardingCard>
  );
}

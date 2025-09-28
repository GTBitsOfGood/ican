import Confirmation from "@/components/ui/form/confirmation";
import OnboardingCard from "../shared/OnboardingCard";
import OnboardingBackButton from "../shared/OnboardingBackButton";
import OnboardingHeader from "../shared/OnboardingHeader";
import OnboardingActionButton from "../shared/OnboardingActionButton";

interface DisclaimerStepProps {
  consentChecked: boolean;
  onConsentChange: (checked: boolean) => void;
  onBack?: () => void;
  onSubmit?: () => void;
}

export default function DisclaimerStep({
  consentChecked,
  onConsentChange,
  onBack,
  onSubmit,
}: DisclaimerStepProps) {
  return (
    <OnboardingCard>
      <OnboardingBackButton onClick={onBack} />

      <OnboardingHeader
        title="Disclaimer"
        titleColor="red"
        description="This app is not a substitute for medical advice..."
        className="text-5xl"
      />

      <Confirmation
        text="I understand this app is not a substitute for medical advice  "
        checked={consentChecked}
        onChange={onConsentChange}
      />

      <OnboardingActionButton
        text="I understand"
        onClick={onSubmit}
        disabled={!consentChecked}
      />
    </OnboardingCard>
  );
}

import Confirmation from "@/components/ui/form/confirmation";
import OnboardingCard from "../shared/OnboardingCard";
import BackButton from "../../ui/BackButton";
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
    <div className="w-full flex flex-col items-center gap-4">
      <div className="mobile:block desktop:hidden self-start [&>a]:w-16 [&>a]:h-16 [&>a>button]:w-full [&>a>button]:h-full">
        <BackButton onClick={onBack} />
      </div>

      <OnboardingCard>
        <div className="mobile:hidden desktop:block [&>a]:w-24 [&>a]:h-24 [&>a>button]:w-full [&>a>button]:h-full">
          <BackButton onClick={onBack} />
        </div>

        <OnboardingHeader
          title="Disclaimer"
          titleColor="red"
          description="This app is not a substitute for medical advice. iCAN is not responsible for any missed doses."
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
    </div>
  );
}

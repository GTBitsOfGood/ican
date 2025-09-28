import Confirmation from "@/components/ui/form/confirmation";
import OnboardingCard from "../shared/OnboardingCard";
import BackButton from "../../ui/BackButton";
import OnboardingHeader from "../shared/OnboardingHeader";
import OnboardingActionButton from "../shared/OnboardingActionButton";
import { ConsentStepType, OnboardingStep } from "@/types/onboarding";

interface ConsentStepsProps {
  currentStep: ConsentStepType;
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
  const isParent = currentStep === OnboardingStep.ParentUserConsent;

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
    </div>
  );
}

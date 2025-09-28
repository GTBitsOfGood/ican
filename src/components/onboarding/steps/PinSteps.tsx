import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import OnboardingCard from "../shared/OnboardingCard";
import BackButton from "../../ui/BackButton";
import OnboardingHeader from "../shared/OnboardingHeader";
import OnboardingActionButton from "../shared/OnboardingActionButton";
import { PinStepType, OnboardingStep } from "@/types/onboarding";

interface PinStepsProps {
  currentStep: PinStepType;
  pin: string;
  onPinChange: (value: string) => void;
  onBack?: () => void;
  onSubmit?: () => void;
  error?: string;
}

export default function PinSteps({
  currentStep,
  pin,
  onPinChange,
  onBack,
  onSubmit,
  error,
}: PinStepsProps) {
  const isSetup = currentStep === OnboardingStep.ParentPinSetup;

  return (
    <OnboardingCard>
      <BackButton onClick={onBack} />

      <OnboardingHeader
        subtitle="Hey Parents,"
        title={isSetup ? "Set Security Pin!" : "Please Confirm Your Pin!"}
        description="This helps us protect sensitive information."
      />

      {/* Temporary error message */}
      {error && (
        <div className="text-red-500 rounded text-center font-bold text-4xl font-quantico !mb-0">
          {error}
        </div>
      )}

      <div className="w-full">
        <InputOTP
          maxLength={4}
          value={pin}
          onChange={onPinChange}
          pattern={REGEXP_ONLY_DIGITS}
          containerClassName="w-full gap-0 [&_input]:!w-full"
        >
          <InputOTPGroup className="w-full flex justify-between items-center h-40">
            {[0, 1, 2, 3].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-full w-auto aspect-square border border-black text-6xl font-bold font-quantico bg-neutral-300 text-black [&.ring-1]:bg-white [&.ring-1]:outline [&.ring-1]:outline-4 [&.ring-1]:outline-offset-[-4px] [&.ring-1]:outline-Blue-1000 [&.ring-1]:text-Blue-1000 [&.ring-1]:border-none"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <OnboardingActionButton
        text="Enter"
        onClick={onSubmit}
        disabled={pin.length !== 4}
      />
    </OnboardingCard>
  );
}

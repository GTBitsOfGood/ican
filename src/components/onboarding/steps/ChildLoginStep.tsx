import BackButton from "@/components/ui/BackButton";
import { ChildPasswordType } from "@/types/user";
import OnboardingActionButton from "../shared/OnboardingActionButton";
import OnboardingCard from "../shared/OnboardingCard";
import OnboardingHeader from "../shared/OnboardingHeader";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";

interface ChildLoginStepProps {
  childPasswordType: ChildPasswordType;
  password: string;
  colorSequence: string[];
  error: string;
  onBack: () => void;
  onTypeChange: (value: ChildPasswordType) => void;
  onPasswordChange: (value: string) => void;
  onAddColor: (value: string) => void;
  onRemoveColor: (value: string) => void;
  onClearColors: () => void;
  onSubmit: () => void;
}

export default function ChildLoginStep({
  childPasswordType,
  password,
  colorSequence,
  error,
  onBack,
  onTypeChange,
  onPasswordChange,
  onAddColor,
  onRemoveColor,
  onClearColors,
  onSubmit,
}: ChildLoginStepProps) {
  const isNormal = childPasswordType === ChildPasswordType.NORMAL;
  const isDisabled = isNormal
    ? !/^\d{4}$/.test(password.trim())
    : colorSequence.length < 4;

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
          subtitle="Parent Setup"
          title="Create Child Login"
          description="Choose the child login style and set a simple password."
        />

        {error && (
          <div className="text-red-500 rounded text-center font-bold text-xl desktop:text-3xl font-quantico">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <label className="text-white text-lg desktop:text-2xl font-quantico">
            Child password type
          </label>
          <select
            value={childPasswordType}
            onChange={(e) => onTypeChange(e.target.value as ChildPasswordType)}
            className="h-12 px-3 text-black text-lg font-quantico"
          >
            <option value={ChildPasswordType.NORMAL}>Pin</option>
            <option value={ChildPasswordType.COLOR}>Color</option>
            <option value={ChildPasswordType.SHAPE}>Shape</option>
            <option value={ChildPasswordType.EMOJI}>Emoji</option>
            <option value={ChildPasswordType.PATTERN}>Pattern</option>
          </select>
        </div>

        {isNormal ? (
          <div className="flex flex-col gap-3">
            <p className="text-white/80 text-base desktop:text-xl">
              Enter a 4-digit pin below
            </p>
            <InputOTP
              maxLength={4}
              value={password}
              onChange={onPasswordChange}
              pattern={REGEXP_ONLY_DIGITS}
            >
              <InputOTPGroup className="flex items-center gap-3">
                {[0, 1, 2, 3].map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className="h-[120px] w-[120px] rounded-[4px] border border-black/10 bg-[#FAFAFA] text-5xl text-black first:rounded-[4px] first:border last:rounded-[4px]"
                  />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>
        ) : (
          <div className="flex flex-col">
            <ChildColorPicker
              sequence={colorSequence}
              onAddColor={onAddColor}
              onRemoveColor={onRemoveColor}
              onClear={onClearColors}
              view="change"
              passwordType={childPasswordType}
            />
          </div>
        )}

        <OnboardingActionButton
          text="Save Child Login"
          onClick={onSubmit}
          disabled={isDisabled}
        />
      </OnboardingCard>
    </div>
  );
}

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
    <div className="w-full flex flex-col items-center gap-4 mb-8">
      <div className="mobile:block desktop:hidden self-start [&>a]:h-16 [&>a]:w-16 [&>button]:h-8 [&>button]:w-8 [&>a>button]:h-full [&>a>button]:w-full">
        <BackButton onClick={onBack} />
      </div>
      <OnboardingCard>
        <div className="mobile:hidden desktop:block [&>a]:h-24 [&>a]:w-24 [&>button]:h-24 [&>button]:w-24 [&>a>button]:h-full [&>a>button]:w-full">
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
            <div className="w-full mb-4 desktop:mb-0">
              <InputOTP
                maxLength={4}
                value={password}
                onChange={onPasswordChange}
                pattern={REGEXP_ONLY_DIGITS}
                containerClassName="w-full"
              >
                <InputOTPGroup className="w-full flex items-center gap-2 desktop:gap-4">
                  {[0, 1, 2, 3].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className="flex-1 h-16 desktop:h-auto desktop:aspect-square min-w-0 border border-black rounded-none bg-neutral-300 text-black text-3xl desktop:text-5xl font-bold font-quantico [&.ring-1]:bg-white [&.ring-1]:outline [&.ring-1]:outline-2 desktop:[&.ring-1]:outline-4 [&.ring-1]:outline-offset-[-2px] desktop:[&.ring-1]:outline-offset-[-4px] [&.ring-1]:outline-icanBlue-200 [&.ring-1]:text-icanBlue-200 [&.ring-1]:border-none"
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
            </div>
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

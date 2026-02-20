import BackButton from "@/components/ui/BackButton";
import { ChildPasswordType } from "@/types/user";
import OnboardingActionButton from "../shared/OnboardingActionButton";
import OnboardingCard from "../shared/OnboardingCard";
import OnboardingHeader from "../shared/OnboardingHeader";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";

interface ChildLoginStepProps {
  childPasswordType: ChildPasswordType;
  password: string;
  confirmPassword: string;
  colorSequence: string[];
  error: string;
  onBack: () => void;
  onTypeChange: (value: ChildPasswordType) => void;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onAddColor: (value: string) => void;
  onClearColors: () => void;
  onSubmit: () => void;
}

export default function ChildLoginStep({
  childPasswordType,
  password,
  confirmPassword,
  colorSequence,
  error,
  onBack,
  onTypeChange,
  onPasswordChange,
  onConfirmPasswordChange,
  onAddColor,
  onClearColors,
  onSubmit,
}: ChildLoginStepProps) {
  const isNormal = childPasswordType === ChildPasswordType.NORMAL;
  const isDisabled = isNormal
    ? password.trim().length < 3 || password !== confirmPassword
    : colorSequence.length < 3;

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
            <option value={ChildPasswordType.NORMAL}>Normal</option>
            <option value={ChildPasswordType.COLOR}>Color Pattern</option>
          </select>
        </div>

        {isNormal ? (
          <div className="flex flex-col gap-3">
            <input
              type="password"
              value={password}
              onChange={(e) => onPasswordChange(e.target.value)}
              placeholder="Child password"
              className="h-12 px-3 text-black text-lg font-quantico"
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => onConfirmPasswordChange(e.target.value)}
              placeholder="Confirm child password"
              className="h-12 px-3 text-black text-lg font-quantico"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <ChildColorPicker
              sequence={colorSequence}
              onAddColor={onAddColor}
              onClear={onClearColors}
              theme="dark"
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

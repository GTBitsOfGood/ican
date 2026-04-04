import { useState } from "react";
import { useRouter } from "next/router";
import WelcomeSteps from "@/components/onboarding/steps/WelcomeSteps";
import PinSteps from "@/components/onboarding/steps/PinSteps";
import ConsentSteps from "@/components/onboarding/steps/ConsentSteps";
import DisclaimerStep from "@/components/onboarding/steps/DisclaimerStep";
import CompletionStep from "@/components/onboarding/steps/CompletionStep";
import ChildLoginStep from "@/components/onboarding/steps/ChildLoginStep";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import {
  useUpdateChildLogin,
  useUpdatePin,
} from "@/components/hooks/useSettings";
import { OnboardingStep, UserType } from "@/types/onboarding";
import { ChildPasswordType, isPatternChildPasswordType } from "@/types/user";

export default function Onboard() {
  const router = useRouter();
  const [overrideStep, setCurrentStep] = useState<OnboardingStep | null>(null);
  const [overrideUserType, setUserType] = useState<UserType>(null);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [childPasswordType, setChildPasswordType] = useState<ChildPasswordType>(
    ChildPasswordType.COLOR,
  );
  const [childPassword, setChildPassword] = useState<string>("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");
  const [hasSavedParentPin, setHasSavedParentPin] = useState<boolean>(false);
  const { userId } = useUser();
  const updatePin = useUpdatePin();
  const updateChildLogin = useUpdateChildLogin();

  const stepFromUrl =
    router.isReady &&
    typeof router.query.step === "string" &&
    Object.values(OnboardingStep).includes(router.query.step as OnboardingStep)
      ? (router.query.step as OnboardingStep)
      : null;

  const userTypeFromUrl =
    router.isReady &&
    (router.query.userType === "parent" || router.query.userType === "child")
      ? (router.query.userType as UserType)
      : null;

  const currentStep = overrideStep ?? stepFromUrl ?? OnboardingStep.Welcome;
  const userType = overrideUserType ?? userTypeFromUrl;

  // Navigation functions
  const goToWelcome = () => setCurrentStep(OnboardingStep.Welcome);
  const goToSetup = () => setCurrentStep(OnboardingStep.Setup);
  const goToParentPinSetup = () =>
    setCurrentStep(OnboardingStep.ParentPinSetup);
  const goToParentPinConfirm = () =>
    setCurrentStep(OnboardingStep.ParentPinConfirm);
  const goToParentChildLoginSetup = () =>
    setCurrentStep(OnboardingStep.ParentChildLoginSetup);
  const goToParentConsent = () =>
    setCurrentStep(OnboardingStep.ParentUserConsent);
  const goToChildConsent = () =>
    setCurrentStep(OnboardingStep.ChildUserConsent);
  const goToDisclaimer = () => setCurrentStep(OnboardingStep.Disclaimer);
  const goToCompletion = () => setCurrentStep(OnboardingStep.ChooseMedication);

  // Functions to ensure correct states
  const handleChildSetup = () => {
    if (hasSavedParentPin) {
      updatePin.mutate(null, {
        onSuccess: () => {
          setHasSavedParentPin(false);
        },
        onError: (error) => {
          console.error("Error removing parental pin:", error);
        },
      });
    }
    setPin("");
    setConfirmPin("");
    setPinError("");
    setConsentChecked(false);
    setUserType("child");
    goToChildConsent();
  };

  const handleParentSetup = () => {
    setUserType("parent");
    goToParentPinSetup();
  };

  const handlePinSubmit = () => {
    if (pin.length !== 4) return;

    if (currentStep === OnboardingStep.ParentPinSetup) {
      setConfirmPin(pin);
      setPin("");
      setPinError("");
      goToParentPinConfirm();
    } else if (currentStep === OnboardingStep.ParentPinConfirm) {
      if (pin !== confirmPin) {
        setPinError("Pins don't match");
        setPin("");
        return;
      }

      // If pins are the same, we can save it
      updatePin.mutate(confirmPin, {
        onSuccess: () => {
          setPinError("");
          setHasSavedParentPin(true);
          goToParentChildLoginSetup();
        },
        onError: (error) => {
          setPinError(
            error instanceof Error
              ? `Error saving pin: ${error.message}`
              : "Error saving pin",
          );
        },
      });
    }
  };

  const handleChildLoginSubmit = () => {
    const candidatePassword = isPatternChildPasswordType(childPasswordType)
      ? colorSequence.join("-")
      : childPassword.trim();

    if (
      isPatternChildPasswordType(childPasswordType) &&
      colorSequence.length < 4
    ) {
      setPinError("Please enter 4 selections.");
      return;
    }

    if (
      childPasswordType === ChildPasswordType.NORMAL &&
      !/^\d{4}$/.test(candidatePassword)
    ) {
      setPinError("Please enter a valid 4-digit PIN.");
      return;
    }

    updateChildLogin.mutate(
      {
        childPassword: candidatePassword,
        childPasswordType,
      },
      {
        onSuccess: () => {
          setPinError("");
          goToParentConsent();
        },
        onError: (error) => {
          setPinError(
            error instanceof Error
              ? `Error saving child login: ${error.message}`
              : "Error saving child login",
          );
        },
      },
    );
  };

  const handleConsentSubmit = () => {
    if (!consentChecked) return;
    setConsentChecked(false);
    goToDisclaimer();
  };

  const handleDisclaimerSubmit = () => {
    if (!consentChecked) return;
    goToCompletion();
  };

  const handleChooseMedication = () => {
    router.push(`/medications/?userType=${userType}`);
  };

  const handleChoosePet = () => {
    router.push("/first-pet");
  };

  const handleBack = () => {
    switch (currentStep) {
      case OnboardingStep.Setup:
        goToWelcome();
        break;
      case OnboardingStep.ParentPinSetup:
        goToSetup();
        break;
      case OnboardingStep.ParentPinConfirm:
        setPin(confirmPin);
        goToParentPinSetup();
        break;
      case OnboardingStep.ParentUserConsent:
        goToParentChildLoginSetup();
        break;
      case OnboardingStep.ParentChildLoginSetup:
        goToParentPinConfirm();
        break;
      case OnboardingStep.ChildUserConsent:
        goToSetup();
        break;
      case OnboardingStep.Disclaimer:
        if (userType === "parent") {
          goToParentConsent();
        } else {
          goToChildConsent();
        }
        break;
      case OnboardingStep.ChooseMedication:
        goToDisclaimer();
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return (
          <WelcomeSteps
            currentStep={OnboardingStep.Welcome}
            onGetStarted={goToSetup}
          />
        );
      case OnboardingStep.Setup:
        return (
          <WelcomeSteps
            currentStep={OnboardingStep.Setup}
            onChildSetup={handleChildSetup}
            onParentSetup={handleParentSetup}
          />
        );
      case OnboardingStep.ParentPinSetup:
        return (
          <PinSteps
            currentStep={OnboardingStep.ParentPinSetup}
            pin={pin}
            onPinChange={setPin}
            onBack={handleBack}
            onSubmit={handlePinSubmit}
          />
        );
      case OnboardingStep.ParentPinConfirm:
        return (
          <PinSteps
            currentStep={OnboardingStep.ParentPinConfirm}
            pin={pin}
            onPinChange={(value) => {
              setPin(value);
              if (pinError) setPinError("");
            }}
            onBack={handleBack}
            onSubmit={handlePinSubmit}
            error={pinError}
          />
        );
      case OnboardingStep.ParentChildLoginSetup:
        return (
          <ChildLoginStep
            childPasswordType={childPasswordType}
            password={childPassword}
            colorSequence={colorSequence}
            error={pinError}
            onBack={handleBack}
            onTypeChange={(value) => {
              setPinError("");
              setChildPasswordType(value);
              setChildPassword("");
              setColorSequence([]);
            }}
            onPasswordChange={(value) => {
              setPinError("");
              setChildPassword(value);
            }}
            onAddColor={(value) => {
              setPinError("");
              setColorSequence((prev) =>
                prev.length >= 4 ? prev : [...prev, value],
              );
            }}
            onRemoveColor={(value) => {
              setPinError("");
              setColorSequence((prev) => {
                const index = prev.lastIndexOf(value);
                if (index === -1) return prev;
                return [...prev.slice(0, index), ...prev.slice(index + 1)];
              });
            }}
            onClearColors={() => {
              setPinError("");
              setColorSequence([]);
            }}
            onSubmit={handleChildLoginSubmit}
          />
        );
      case OnboardingStep.ParentUserConsent:
        return (
          <ConsentSteps
            currentStep={OnboardingStep.ParentUserConsent}
            consentChecked={consentChecked}
            onConsentChange={setConsentChecked}
            onBack={handleBack}
            onSubmit={handleConsentSubmit}
          />
        );
      case OnboardingStep.ChildUserConsent:
        return (
          <ConsentSteps
            currentStep={OnboardingStep.ChildUserConsent}
            consentChecked={consentChecked}
            onConsentChange={setConsentChecked}
            onBack={handleBack}
            onSubmit={handleConsentSubmit}
          />
        );
      case OnboardingStep.Disclaimer:
        return (
          <DisclaimerStep
            consentChecked={consentChecked}
            onConsentChange={setConsentChecked}
            onBack={handleBack}
            onSubmit={handleDisclaimerSubmit}
          />
        );
      case OnboardingStep.ChooseMedication:
        return (
          <CompletionStep
            userType={userType}
            currentStep={OnboardingStep.ChooseMedication}
            onBack={handleBack}
            onComplete={handleChooseMedication}
          />
        );
      // TODO, after choosing pet, onboarding status for user should be set to true
      case OnboardingStep.ChoosePet:
        return (
          <CompletionStep
            userType={userType}
            currentStep={OnboardingStep.ChoosePet}
            onBack={handleBack}
            onComplete={handleChoosePet}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AuthorizedRoute>
      <div className="flex min-h-screen overflow-y-auto bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-2 pt-8 desktop:pt-8 items-start justify-center">
        {renderCurrentStep()}
      </div>
    </AuthorizedRoute>
  );
}

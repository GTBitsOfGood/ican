import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import WelcomeSteps from "@/components/onboarding/steps/WelcomeSteps";
import PinSteps from "@/components/onboarding/steps/PinSteps";
import ConsentSteps from "@/components/onboarding/steps/ConsentSteps";
import DisclaimerStep from "@/components/onboarding/steps/DisclaimerStep";
import CompletionStep from "@/components/onboarding/steps/CompletionStep";
import ChildLoginStep from "@/components/onboarding/steps/ChildLoginStep";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import { useUpdateOnboardingStatus } from "@/components/hooks/useAuth";
import {
  useUpdateChildLogin,
  useUpdatePin,
} from "@/components/hooks/useSettings";
import { OnboardingStep, UserType } from "@/types/onboarding";
import { ChildPasswordType } from "@/types/user";

export default function Onboard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(OnboardingStep.Welcome);
  const [userType, setUserType] = useState<UserType>(null);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [childPasswordType, setChildPasswordType] = useState<ChildPasswordType>(
    ChildPasswordType.NORMAL,
  );
  const [childPassword, setChildPassword] = useState<string>("");
  const [confirmChildPassword, setConfirmChildPassword] = useState<string>("");
  const [colorSequence, setColorSequence] = useState<string[]>([]);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");
  const [hasSavedParentPin, setHasSavedParentPin] = useState<boolean>(false);
  const { userId } = useUser();
  const updateOnboardingStatus = useUpdateOnboardingStatus();
  const updatePin = useUpdatePin();
  const updateChildLogin = useUpdateChildLogin();

  // Handle URL step and userType parameters
  useEffect(() => {
    if (router.isReady) {
      const { step, userType: urlUserType } = router.query;

      if (
        typeof step === "string" &&
        Object.values(OnboardingStep).includes(step as OnboardingStep)
      ) {
        setCurrentStep(step as OnboardingStep);
      }

      if (urlUserType === "parent" || urlUserType === "child") {
        setUserType(urlUserType);
      }
    }
  }, [router.isReady, router.query]);

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
          goToParentChildLoginSetup();
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
    const candidatePassword =
      childPasswordType === ChildPasswordType.COLOR
        ? colorSequence.join("-")
        : childPassword.trim();

    if (candidatePassword.length < 3) {
      setPinError("Child password must be at least 3 characters.");
      return;
    }

    if (
      childPasswordType === ChildPasswordType.NORMAL &&
      candidatePassword !== confirmChildPassword.trim()
    ) {
      setPinError("Child passwords don't match.");
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
    if (userId) {
      updateOnboardingStatus.mutate(
        { userId, isOnboarded: true },
        {
          onSuccess: () => {
            router.push("/first-pet");
          },
          onError: (error) => {
            console.error("Error updating onboarding status:", error);
          },
        },
      );
    }
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
            confirmPassword={confirmChildPassword}
            colorSequence={colorSequence}
            error={pinError}
            onBack={handleBack}
            onTypeChange={(value) => {
              setPinError("");
              setChildPasswordType(value);
              setChildPassword("");
              setConfirmChildPassword("");
              setColorSequence([]);
            }}
            onPasswordChange={(value) => {
              setPinError("");
              setChildPassword(value);
            }}
            onConfirmPasswordChange={(value) => {
              setPinError("");
              setConfirmChildPassword(value);
            }}
            onAddColor={(value) => {
              setPinError("");
              setColorSequence((prev) => [...prev, value]);
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
      <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-2 pt-8 desktop:pt-2 items-start desktop:items-center justify-center">
        {renderCurrentStep()}
      </div>
    </AuthorizedRoute>
  );
}

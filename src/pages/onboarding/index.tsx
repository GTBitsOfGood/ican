import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import WelcomeSteps from "@/components/onboarding/steps/WelcomeSteps";
import PinSteps from "@/components/onboarding/steps/PinSteps";
import ConsentSteps from "@/components/onboarding/steps/ConsentSteps";
import DisclaimerStep from "@/components/onboarding/steps/DisclaimerStep";
import CompletionStep from "@/components/onboarding/steps/CompletionStep";
import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useUser } from "@/components/UserContext";
import { useUpdateOnboardingStatus } from "@/components/hooks/useAuth";
import { useUpdatePin } from "@/components/hooks/useSettings";
import { OnboardingStep, UserType } from "@/types/onboarding";

export default function Onboard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(OnboardingStep.Welcome);
  const [userType, setUserType] = useState<UserType>(null);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [consentChecked, setConsentChecked] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>("");
  const { userId } = useUser();
  const updateOnboardingStatus = useUpdateOnboardingStatus();
  const updatePin = useUpdatePin();

  // Handle URL step parameter
  useEffect(() => {
    if (router.isReady) {
      const { step } = router.query;

      if (
        typeof step === "string" &&
        Object.values(OnboardingStep).includes(step as OnboardingStep)
      ) {
        setCurrentStep(step as OnboardingStep);
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
  const goToParentConsent = () =>
    setCurrentStep(OnboardingStep.ParentUserConsent);
  const goToChildConsent = () =>
    setCurrentStep(OnboardingStep.ChildUserConsent);
  const goToDisclaimer = () => setCurrentStep(OnboardingStep.Disclaimer);
  const goToCompletion = () => setCurrentStep(OnboardingStep.ChooseMedication);

  // Functions to ensure correct states
  const handleChildSetup = () => {
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

      // Pins match, save to account
      updatePin.mutate(confirmPin, {
        onSuccess: () => {
          setPinError("");
          goToParentConsent();
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
    window.location.href = "/medications/";
  };

  const handleChoosePet = () => {
    if (userId) {
      updateOnboardingStatus.mutate(
        { userId, isOnboarded: true },
        {
          onSuccess: () => {
            window.location.href = "/first-pet";
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
              if (pinError) setPinError(""); // Clear error when user starts typing
            }}
            onBack={handleBack}
            onSubmit={handlePinSubmit}
            error={pinError}
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
            currentStep={OnboardingStep.ChooseMedication}
            onBack={handleBack}
            onComplete={handleChooseMedication}
          />
        );
      case OnboardingStep.ChoosePet:
        return (
          <CompletionStep
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

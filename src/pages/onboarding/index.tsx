// import AuthorizedRoute from "@/components/AuthorizedRoute";
import { useState } from "react";
import WelcomeSteps from "@/components/onboarding/steps/WelcomeSteps";
import PinSteps from "@/components/onboarding/steps/PinSteps";
import ConsentSteps from "@/components/onboarding/steps/ConsentSteps";
import DisclaimerStep from "@/components/onboarding/steps/DisclaimerStep";
import CompletionStep from "@/components/onboarding/steps/CompletionStep";

const enum OnboardingStep {
  Welcome,
  Setup,
  ParentPinSetup,
  ParentPinConfirm,
  ParentUserConsent,
  ChildUserConsent,
  Disclaimer,
  Awesome,
  Completed,
}

type UserType = "parent" | "child" | null;

export default function Onboard() {
  const [currentStep, setCurrentStep] = useState(OnboardingStep.Awesome);
  const [userType, setUserType] = useState<UserType>(null);
  const [pin, setPin] = useState<string>("");
  const [confirmPin, setConfirmPin] = useState<string>("");
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

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
  const goToCompletion = () => setCurrentStep(OnboardingStep.Awesome);

  // Flow specific navigation to set correct states
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
      goToParentPinConfirm();
    } else if (currentStep === OnboardingStep.ParentPinConfirm) {
      if (pin !== confirmPin) {
        // TODO: Show error message for PIN mismatch
        setPin("");
        return;
      }
      goToParentConsent();
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

  const handleCompletion = () => {
    // TODO: Navigate to medication creation
    console.log("Onboarding completed!");
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
      case OnboardingStep.Awesome:
        goToDisclaimer();
        break;
      default:
        break;
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case OnboardingStep.Welcome:
        return <WelcomeSteps currentStep="Welcome" onGetStarted={goToSetup} />;
      case OnboardingStep.Setup:
        return (
          <WelcomeSteps
            currentStep="Setup"
            onChildSetup={handleChildSetup}
            onSelfSetup={handleParentSetup}
          />
        );
      case OnboardingStep.ParentPinSetup:
        return (
          <PinSteps
            currentStep="Setup"
            pin={pin}
            onPinChange={setPin}
            onBack={handleBack}
            onSubmit={handlePinSubmit}
          />
        );
      case OnboardingStep.ParentPinConfirm:
        return (
          <PinSteps
            currentStep="Confirm"
            pin={pin}
            onPinChange={setPin}
            onBack={handleBack}
            onSubmit={handlePinSubmit}
          />
        );
      case OnboardingStep.ParentUserConsent:
        return (
          <ConsentSteps
            currentStep="Parent"
            consentChecked={consentChecked}
            onConsentChange={setConsentChecked}
            onBack={handleBack}
            onSubmit={handleConsentSubmit}
          />
        );
      case OnboardingStep.ChildUserConsent:
        return (
          <ConsentSteps
            currentStep="Child"
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
      case OnboardingStep.Awesome:
        return (
          <CompletionStep
            currentStep="Awesome"
            onBack={handleBack}
            onComplete={handleCompletion}
          />
        );
      case OnboardingStep.Completed:
        return (
          <CompletionStep
            currentStep="Completed"
            onBack={handleBack}
            onComplete={handleCompletion}
          />
        );
      default:
        return null;
    }
  };

  return (
    // TODO Uncomment authorized route when completed, with testing
    // <AuthorizedRoute>
    <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] pt-2 p-2 items-center justify-center">
      {renderCurrentStep()}
    </div>
    // </AuthorizedRoute>
  );
}

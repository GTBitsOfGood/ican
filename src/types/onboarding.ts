export enum OnboardingStep {
  Welcome = "welcome",
  Setup = "setup",
  ParentPinSetup = "parent-pin-setup",
  ParentPinConfirm = "parent-pin-confirm",
  ParentChildLoginSetup = "parent-child-login-setup",
  ParentUserConsent = "parent-user-consent",
  ChildUserConsent = "child-user-consent",
  Disclaimer = "disclaimer",
  ChooseMedication = "choose-medication",
  ChoosePet = "choose-pet",
}

export type UserType = "parent" | "child" | null;

// Derived types for component props
export type WelcomeStepType = OnboardingStep.Welcome | OnboardingStep.Setup;
export type PinStepType =
  | OnboardingStep.ParentPinSetup
  | OnboardingStep.ParentPinConfirm;
export type ConsentStepType =
  | OnboardingStep.ParentUserConsent
  | OnboardingStep.ChildUserConsent;
export type CompletionStepType =
  | OnboardingStep.ChooseMedication
  | OnboardingStep.ChoosePet;

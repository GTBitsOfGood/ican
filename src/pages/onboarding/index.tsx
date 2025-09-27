// import AuthorizedRoute from "@/components/AuthorizedRoute";
import Image from "next/image";
import { useState } from "react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Confirmation from "@/components/ui/form/confirmation";

const enum OnboardingStep {
  Welcome,
  Setup,
  ParentPinSetup,
  ParentPinConfirm,
  ParentUserConsent,
  ChildUserConsent,
  Disclaimer,
  Awesome,
}

export default function Onboard() {
  const [currentStep] = useState(OnboardingStep.ParentPinSetup);
  const [pin, setPin] = useState<string>("");
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  return (
    // TODO Uncomment authorized route when completed, with testing
    // <AuthorizedRoute>
    <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] pt-2 p-2 items-center justify-center">
      {/* TODO Fix / Condense this disgusting div */}
      {(currentStep === OnboardingStep.Welcome ||
        currentStep === OnboardingStep.Setup) && (
        <div className="h-[486px] px-16 bg-white rounded-[64px] inline-flex flex-col justify-center items-center gap-8 overflow-hidden">
          {/* TODO Make this responsive for desktop and mobile */}
          <div className="w-full h-40 relative">
            <Image
              src="/icanLogo.svg"
              alt="International Children Advisory Network Logo"
              fill
              className="object-contain"
            />
          </div>
          {currentStep === OnboardingStep.Welcome && (
            <>
              <p className="font-quantico font-bold text-black text-bold text-4xl text-center">
                Helping families track medications with ease.
              </p>
              {/* Add button functionality */}
              <button className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']">
                Get Started
              </button>
            </>
          )}
          {currentStep === OnboardingStep.Setup && (
            <>
              <p className="font-quantico font-bold text-black text-bold text-4xl text-center">
                Who are you setting up this app for?
              </p>
              {/* Add button functionality */}
              <div className="w-full gap-9 flex flex-col">
                <button className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']">
                  For My Child!
                </button>
                <button className="bg-[#77A000] hover:bg-blue-900 transition-colors self-stretch px-4 py-3 inline-flex justify-center items-center gap-2.5 overflow-hidden text-white text-3xl font-normal font-['Quantico']">
                  For Myself!
                </button>
              </div>
            </>
          )}
        </div>
      )}
      {(currentStep === OnboardingStep.ParentPinSetup ||
        currentStep === OnboardingStep.ParentPinConfirm) && (
        <div className="px-12 py-14 w-[998px] bg-[#4C539B]/80 rounded-[15px] backdrop-blur-[5px] flex flex-col gap-12 overflow-hidden">
          {/* Back Button */}
          <div className="h-[6.5rem]">
            <button className="aspect-square h-full relative">
              <Image
                src="/assets/BackArrowIcon.svg"
                alt="Back Arrow"
                fill
                className="object-contain"
              />
            </button>
          </div>

          {/* Header Section */}
          <div className="w-full flex flex-col gap-2.5">
            <div>
              <p className="text-white/60 text-6xl font-bold font-quantico">
                Hey Parents,
              </p>
              <p className="text-white text-6xl font-bold font-quantico">
                {currentStep === OnboardingStep.ParentPinSetup
                  ? "Set Security Pin!"
                  : "Please Confirm Your Pin!"}
              </p>
            </div>
            <p className="text-stone-50 text-2xl font-normal font-quantico">
              This helps us protect sensitive information.
            </p>
          </div>
          {/* Body */}
          {/* PIN Input Section */}
          <div className="w-full">
            <InputOTP
              maxLength={4}
              value={pin}
              onChange={(newValue: string) => setPin(newValue)}
              pattern={REGEXP_ONLY_DIGITS}
              containerClassName="w-full gap-0 [&_input]:!w-full" // Gets rid of 40px extra it was adding
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

          {/* Next Page Button */}
          <div className="w-full flex justify-end">
            <button className="px-5 py-2.5 bg-lime-200 hover:bg-gray-100 transition-colors">
              <div className="text-black/50 text-3xl font-normal font-quantico">
                Enter
              </div>
            </button>
          </div>
        </div>
      )}
      {(currentStep === OnboardingStep.ParentUserConsent ||
        currentStep === OnboardingStep.ChildUserConsent) && (
        <div className="px-12 py-14 w-[998px] bg-[#4C539B]/80 rounded-[15px] backdrop-blur-[5px] flex flex-col gap-12 overflow-hidden">
          {/* Back Button */}
          <div className="h-[6.5rem]">
            <button className="aspect-square h-full relative">
              <Image
                src="/assets/BackArrowIcon.svg"
                alt="Back Arrow"
                fill
                className="object-contain"
              />
            </button>
          </div>

          {/* Header Section */}
          <div className="w-full flex flex-col gap-2.5">
            <div>
              <p className="text-white/60 text-6xl font-bold font-quantico">
                {currentStep === OnboardingStep.ParentUserConsent
                  ? "Hey parents, don't forget your"
                  : "Hey Kids"}
              </p>
              <p className="text-white text-6xl font-bold font-quantico">
                {currentStep === OnboardingStep.ParentUserConsent
                  ? "Medical Responsibility"
                  : "Before You Begin..."}
              </p>
            </div>
            <p className="text-stone-50 text-2xl font-normal font-quantico">
              {currentStep === OnboardingStep.ParentUserConsent
                ? "Before you can add new medications, please review the terms below and confirm your agreement below."
                : "Please confirm you have your Parent's permission to use this app."}
            </p>
          </div>
          {/* Confirmation */}
          <Confirmation
            text={
              currentStep === OnboardingStep.ParentUserConsent
                ? "I accept responsibility for logging my child's medicine"
                : "I have my parent's permission to use this. "
            }
            checked={consentChecked}
            onChange={setConsentChecked}
          />
          {/* Next Page Button */}
          <div className="w-full flex justify-end">
            <button className="px-5 py-2.5 bg-lime-200 hover:bg-gray-100 transition-colors">
              <div className="text-black/50 text-3xl font-normal font-quantico">
                I Accept
              </div>
            </button>
          </div>
        </div>
      )}
      {currentStep === OnboardingStep.Disclaimer && (
        <div className="px-12 py-14 w-[998px] bg-[#4C539B]/80 rounded-[15px] backdrop-blur-[5px] flex flex-col gap-12 overflow-hidden">
          {/* Back Button */}
          <div className="h-[6.5rem]">
            <button className="aspect-square h-full relative">
              <Image
                src="/assets/BackArrowIcon.svg"
                alt="Back Arrow"
                fill
                className="object-contain"
              />
            </button>
          </div>

          {/* Header Section */}
          <div className="w-full flex flex-col gap-2.5">
            <div>
              <p className="text-red-200 text-6xl font-bold font-quantico">
                Disclaimer
              </p>
              <p className="text-white text-5xl font-bold font-quantico">
                This app is not a substitute for medical advice...
              </p>
            </div>
            {/* <p className="text-stone-50 text-2xl font-normal font-quantico">

            </p> */}
          </div>
          {/* Confirmation */}
          <Confirmation
            text="I understand this app is not a substitute for medical advice  "
            checked={consentChecked}
            onChange={setConsentChecked}
          />
          {/* Next Page Button */}
          <div className="w-full flex justify-end">
            <button className="px-5 py-2.5 bg-lime-200 hover:bg-gray-100 transition-colors">
              <div className="text-black/50 text-3xl font-normal font-quantico">
                I understand
              </div>
            </button>
          </div>
        </div>
      )}
      {currentStep === OnboardingStep.Awesome && (
        <div className="px-12 py-14 w-[998px] bg-[#4C539B]/80 rounded-[15px] backdrop-blur-[5px] flex flex-col gap-12 overflow-hidden">
          {/* Back Button */}
          <div className="h-[6.5rem]">
            <button className="aspect-square h-full relative">
              <Image
                src="/assets/BackArrowIcon.svg"
                alt="Back Arrow"
                fill
                className="object-contain"
              />
            </button>
          </div>

          {/* Header Section */}
          <div className="w-full flex flex-col gap-2.5">
            <div>
              {/* <p className="text-red-200 text-6xl font-bold font-quantico">
                Disclaimer
              </p> */}
              <p className="text-white text-5xl font-bold font-quantico">
                Awesome!
              </p>
            </div>
            <p className="text-white text-5xl font-bold font-quantico">
              {
                "You've accepted the terms. Now let's set up your child's medications."
              }
            </p>
          </div>
          {/* Next Page Button */}
          <div className="w-full flex justify-end">
            <button className="px-5 py-2.5 bg-lime-200 hover:bg-gray-100 transition-colors">
              <div className="text-black/50 text-3xl font-normal font-quantico">
                I understand
              </div>
            </button>
          </div>
        </div>
      )}
    </div>
    // </AuthorizedRoute>
  );
}

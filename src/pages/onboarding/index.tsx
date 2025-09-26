// import AuthorizedRoute from "@/components/AuthorizedRoute";
import Image from "next/image";
import { useState } from "react";

const enum OnboardingStep {
  Welcome,
  UserSelection,
  ParentPinSetup,
  ParentUserConsent,
  ChildUserConsent,
  Disclaimer,
  Awesome,
}

export default function Onboard() {
  const [currentStep] = useState(OnboardingStep.Welcome);

  return (
    // TODO Uncomment authorized route when completed, with testing
    // <AuthorizedRoute>
    <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] pt-2 p-2">
      {/* TODO Fix / Condense this disgusting div */}
      {currentStep === OnboardingStep.Welcome && (
        <div className="self-center flex flex-col p-4 font-quantico items-center justify-center rounded-[64px] mobile:w-[60%] tiny:w-[80%] minimized:w-[65%] short:w-[55%] desktop:w-[40%] bg-white mx-auto overflow-scroll">
          {/* TODO Make this responsive for desktop and mobile */}
          <div className="w-full h-40 relative">
            <Image
              src="/icanLogo.svg"
              alt="International Children Advisory Network Logo"
              fill
              className="object-contain"
            />
          </div>
          {/* Switch to <p> as needed or for accessibility */}
          <p className="font-quantico font-bold text-black text-4xl">
            Helping families track medications with ease.
          </p>
          <button className="bg-icanGreen-300">Get Started</button>
        </div>
      )}
    </div>
    // </AuthorizedRoute>
  );
}

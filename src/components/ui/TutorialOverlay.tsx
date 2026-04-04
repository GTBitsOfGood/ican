import Image from "next/image";
import { useTutorial } from "@/components/TutorialContext";

export default function TutorialOverlay() {
  const tutorial = useTutorial();

  if (!tutorial.isActive) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none border-[18px] border-black/35" />
      {tutorial.isReplay && (
        <button
          onClick={tutorial.exitReplay}
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#B7BDEF] px-6 py-2 font-quantico font-bold text-xl text-[#1E2353] cursor-pointer border-4 border-[#4C539B] rounded-lg"
        >
          <Image
            src="/assets/CloseIcon.svg"
            alt="Close"
            width={24}
            height={24}
            className="brightness-0"
          />
          Exit Tutorial
        </button>
      )}
      {!tutorial.isReplay && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#B7BDEF] px-6 py-2 font-quantico font-bold text-xl text-[#1E2353] border-4 border-[#4C539B] rounded-lg">
          Initial Tutorial
        </div>
      )}
    </>
  );
}

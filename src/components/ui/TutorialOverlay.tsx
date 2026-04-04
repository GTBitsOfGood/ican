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
          className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-[10px] bg-[#8A8EAD] px-5 py-2 font-quantico text-[20px] font-bold leading-none text-black cursor-pointer"
        >
          <Image
            src="/assets/CloseIcon.svg"
            alt="Close"
            width={24}
            height={24}
            className="h-[24px] w-[24px] brightness-0"
          />
          Exit Tutorial
        </button>
      )}
      {!tutorial.isReplay && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-[10px] bg-[#8A8EAD] px-5 py-2 font-quantico text-[20px] font-bold leading-none text-black">
          Initial Tutorial
        </div>
      )}
    </>
  );
}

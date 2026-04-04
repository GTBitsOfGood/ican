import Image from "next/image";
import { useTutorial } from "@/components/TutorialContext";

export default function TutorialOverlay() {
  const tutorial = useTutorial();
  const tutorialHeaderClassName =
    "fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-5 rounded-[0.9rem] bg-icanBlue-100 px-[1.8rem] py-2.5 font-quantico text-[1.3rem] font-bold leading-none text-black";

  if (!tutorial.isActive) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 pointer-events-none border-[1.2rem] border-black/35" />
      {tutorial.isReplay && (
        <button
          onClick={tutorial.exitReplay}
          className={`${tutorialHeaderClassName} cursor-pointer`}
        >
          <Image
            src="/assets/CloseIcon.svg"
            alt="Close"
            width={24}
            height={24}
            className="h-[1.5rem] w-[1.5rem] brightness-0"
          />
          Exit Tutorial
        </button>
      )}
      {!tutorial.isReplay && (
        <div className={tutorialHeaderClassName}>Initial Tutorial</div>
      )}
    </>
  );
}

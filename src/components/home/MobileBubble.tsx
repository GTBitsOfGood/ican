import Image from "next/image";
import { motion } from "motion/react";
import { useUserProfile } from "@/components/hooks/useAuth";
import { useUser } from "@/components/UserContext";

interface MobileBubbleProps {
  text?: string;
  animation?: "jump" | "none";
}

export default function MobileBubble({
  text = "Hi There!",
  animation = "none",
}: MobileBubbleProps) {
  const { userId } = useUser();
  const { data: userProfile } = useUserProfile(userId);
  const userName = userProfile?.name || "there";

  const wiggleAnimation =
    animation === "jump"
      ? {
          rotate: [0, -5, 5, -5, 5, 0],
          transition: {
            duration: 0.5,
            repeat: Infinity,
            repeatDelay: 2,
          },
        }
      : {
          rotate: 0,
        };

  const processText = () => {
    let processedText = text;
    if (processedText.includes("{userName}")) {
      processedText = processedText.replace("{userName}", userName);
    }
    if (!processedText.includes("{logButton}")) {
      return processedText;
    }

    const parts = processedText.split("{logButton}");
    return (
      <>
        {parts[0]}
        <span className="relative mx-1 inline-flex h-[28px] w-[28px] translate-y-1 items-center justify-center align-middle">
          <Image
            src="/misc/NavButton.svg"
            alt=""
            fill
            className="pointer-events-none object-fill"
          />
          <span className="relative z-10 flex h-full w-full items-center justify-center gap-0.5 px-1">
            <span className="relative h-[40%] w-auto aspect-square shrink-0 translate-y-[-1px]">
              <Image
                src="/icons/Log.svg"
                alt="Log"
                fill
                className="pointer-events-none object-contain"
              />
            </span>
            <span className="translate-y-[-1px] font-quantico text-[5px] font-bold leading-none text-white">
              LOG
            </span>
          </span>
        </span>
        {parts[1]}
      </>
    );
  };

  return (
    <motion.div
      className="h-full w-[220px] max-w-[calc(100vw-48px)]"
      animate={wiggleAnimation}
    >
      <Image
        src="/misc/ChatBubbleTop.svg"
        alt="chat bubble top"
        width={74}
        height={65}
        className="pointer-events-none h-[24px] w-full object-cover"
      />
      <div className="relative inline-block -mt-[2px] w-full px-3">
        <div className="w-full whitespace-pre-line px-4 py-3 text-center font-quantico text-[16px] font-bold leading-[1.02] tracking-[-0.04em] text-[#111111]">
          {processText()}
        </div>
        <Image
          src="/misc/ChatBubbleMid.svg"
          alt="chat bubble middle"
          fill
          className="pointer-events-none absolute left-[10] top-0 z-[-1] ml-[0.4%] h-full w-full object-fill"
        />
      </div>
      <Image
        src="/misc/ChatBubbleBottom.svg"
        alt="chat bubble bottom"
        width={74}
        height={65}
        className="pointer-events-none -mt-[2px] h-[46px] w-full object-cover"
      />
    </motion.div>
  );
}

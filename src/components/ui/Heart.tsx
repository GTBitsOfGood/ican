import { useEffect, useState } from "react";
import Image from "next/image";

interface HeartProps {
  onComplete?: () => void;
}

export default function Heart({ onComplete }: HeartProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // After animation completes (2 seconds), call onComplete
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onComplete) {
        onComplete();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-40">
      <div
        className="absolute mobile:bottom-[20%] tablet:bottom-[35%] mobile:left-[18%] tablet:left-[26%] animate-float-heart-left"
        style={{
          animationDelay: "0s",
        }}
      >
        <Image
          src="/misc/heart.svg"
          alt="Heart"
          width={60}
          height={60}
          className="w-auto h-auto"
        />
      </div>
      <div
        className="absolute mobile:bottom-[20%] tablet:bottom-[35%] mobile:left-[23%] tablet:left-[31%] animate-float-heart-right"
        style={{
          animationDelay: "0.3s",
        }}
      >
        <Image
          src="/misc/heart.svg"
          alt="Heart"
          width={60}
          height={60}
          className="w-auto h-auto"
        />
      </div>
      <style jsx>{`
        @keyframes float-heart-left {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(-10px) translateX(-5px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) translateX(-30px) scale(0.5);
            opacity: 0;
          }
        }

        @keyframes float-heart-right {
          0% {
            transform: translateY(0) translateX(0) scale(0);
            opacity: 0;
          }
          10% {
            transform: translateY(-10px) translateX(5px) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-150px) translateX(30px) scale(0.5);
            opacity: 0;
          }
        }

        .animate-float-heart-left {
          animation: float-heart-left 2s ease-out forwards;
        }

        .animate-float-heart-right {
          animation: float-heart-right 2s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

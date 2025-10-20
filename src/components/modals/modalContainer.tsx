import Link from "next/link";
import { ReactNode } from "react";

interface modalContainerProps {
  children: ReactNode;
  className?: string;
  title: string;
  back?: string | (() => void);
}

export default function ModalContainer({
  children,
  className,
  title,
  back,
}: modalContainerProps) {
  return (
    <div
      className={`z-30 absolute left-0 bottom-0 tablet:top-1/2 tablet:left-1/2 translate tablet:-translate-x-1/2 tablet:-translate-y-1/2 shadow-lg ${className}`}
    >
      <div
        className={`flex ${back ? "justify-between" : "justify-center"} items-start`}
      >
        <div className="text-white border-b tablet:border-b-2 font-bold text-2xl tablet:text-4xl">
          {title}
        </div>
        {typeof back === "string" ? (
          <Link
            className="font-pixelify -mt-4 tablet:-mt-6 text-[3.25rem] tablet:text-7xl leading-none cursor-pointer"
            href={back}
            style={{ color: "#CEE0A0" }}
          >
            x
          </Link>
        ) : (
          back && (
            <div
              className="font-pixelify -mt-4 tablet:-mt-6 text-[3.25rem] tablet:text-7xl leading-none cursor-pointer"
              onClick={back}
              style={{ color: "#CEE0A0" }}
            >
              x
            </div>
          )
        )}
      </div>
      {children}
    </div>
  );
}

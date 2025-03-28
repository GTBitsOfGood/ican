import Link from "next/link";
import { ReactNode } from "react";

interface modalContainerProps {
  children: ReactNode;
  className?: string;
  title: string;
}

export default function ModalContainer({
  children,
  className,
  title,
}: modalContainerProps) {
  return (
    <div
      className={`z-30 absolute left-0 bottom-0 tablet:top-1/2 tablet:left-1/2 translate tablet:-translate-x-1/2 tablet:-translate-y-1/2 shadow-lg p-8 tablet:p-16 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="border-b tablet:border-b-2 font-bold text-2xl tablet:text-4xl">
          {title}
        </div>
        <Link
          className="font-pixelify text-icanGreen-100 -mt-4 tablet:-mt-6 text-[3.25rem] tablet:text-7xl leading-none cursor-pointer"
          href="/"
        >
          x
        </Link>
      </div>
      {children}
    </div>
  );
}

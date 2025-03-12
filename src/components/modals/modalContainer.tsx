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
      className={`z-30 absolute top-1/2 left-1/2 translate -translate-x-1/2 -translate-y-1/2 shadow-lg p-16 ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="border-b-2 font-bold text-4xl">{title}</div>
        <Link
          className="font-pixelify text-icanGreen-100 -mt-6 text-7xl leading-none cursor-pointer"
          href="/"
        >
          x
        </Link>
      </div>
      {children}
    </div>
  );
}

import Image from "next/image";
import { ReactNode } from "react";

interface AuthShellProps {
  children: ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-[url('/LoginBackground.svg')] font-quantico">
      <div className="mx-auto flex min-h-screen w-full max-w-md items-center justify-center px-4 py-6">
        <div className="relative w-full overflow-hidden rounded-[28px] border-[3px] border-icanBlue-300 bg-icanBlue-300 shadow-[0_10px_0_#7D83B2]">
          <div className="absolute left-3 top-4 h-3 w-3 bg-icanGreen-300" />
          <div className="absolute right-7 top-7 h-2.5 w-2.5 bg-icanGreen-100" />
          <div className="absolute right-12 top-16 h-2.5 w-2.5 bg-icanGreen-300" />

          <div className="relative z-10 px-4 pb-28 pt-5">{children}</div>

          <div className="absolute inset-x-0 bottom-0 h-28 bg-icanGreen-100">
            <div className="absolute inset-x-0 top-0 h-4 bg-icanGreen-300" />
            <Image
              src="/characters/dog.png"
              alt=""
              width={70}
              height={70}
              className="pixelated absolute bottom-4 left-5 h-[70px] w-[70px]"
            />
            <Image
              src="/characters/dino.png"
              alt=""
              width={62}
              height={62}
              className="pixelated absolute bottom-4 right-5 h-[62px] w-[62px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

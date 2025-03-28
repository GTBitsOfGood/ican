import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
        <div className="flex justify-center items-center h-screen">
          <Image
            className="spin"
            src="/loading.svg"
            alt="loading"
            width={100}
            height={100}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      </div>
    </div>
  );
}

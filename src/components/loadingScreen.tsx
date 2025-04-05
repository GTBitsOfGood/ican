import Image from "next/image";

export default function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col relative">
      <div className="flex-1 bg-[url('/bg-home.svg')] bg-cover bg-center bg-no-repeat">
        <div className="flex justify-center items-center h-screen">
          <div className="w-16 sm:w-20 md:w-24 lg:w-32 xl:w-36 2xl:w-40 aspect-square">
            <Image
              className="spin w-full h-full"
              src="/loading.svg"
              alt="loading"
              width={160}
              height={160}
              style={{ filter: "brightness(0) invert(1)" }}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}

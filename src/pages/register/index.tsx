import Image from "next/image";

export default function Home() {
  return (
    <div className="h-screen font-quantico bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-10">
      <div className="flex flex-col items-center justify-center rounded-[64px] w-2/5 bg-white h-full mx-auto">
        <Image
          className="mb-4"
          src="/icanLogo.svg"
          alt="Logo"
          width={248}
          height={167}
        />
        <div className="text-white self-start ml-[10%] text-[28px] font-bold tracking-[-1.44px] text-shadow-default text-stroke-2 text-stroke-default">
          Sign up
        </div>

        <form className="flex flex-col w-[80%] bg-white rounded-lg">
          <input
            className="flex my-4 h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="text"
            placeholder="Name"
          />
          <input
            className="flex h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="email"
            placeholder="Email"
          />
          <input
            className="flex my-4 h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Password"
          />
          <input
            className="flex h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Confirm Password"
          />
          <button
            className="w-full bg-[#2C3694] text-white my-4 h-12"
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

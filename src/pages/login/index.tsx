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
        <div className="self-center w-[80%] my-4 text-left text-black text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
          Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
        </div>
        <div className="text-white self-start ml-[10%] text-[28px] font-bold tracking-[-1.44px] text-shadow-default text-stroke-2 text-stroke-default">
          Log in
        </div>

        <form className="flex flex-col w-[80%] bg-white rounded-lg">
          <input
            className="flex my-4 h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="text"
            placeholder="Email"
          />
          <input
            className="flex h-16 px-4 items-center gap-[10px] text-[28px] text-[#626262] placeholder-[#626262] self-stretch border-2 border-[#747474] bg-white"
            type="password"
            placeholder="Password"
          />
          <p className="text-[#626262] mt-4 self-start font-berlin-sans text-[24px] font-normal underline decoration-solid [text-decoration-skip-ink:none]">
            Forgot Password
          </p>
          <button
            className="w-full bg-[#ACCC6E] text-black my-4 h-12"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

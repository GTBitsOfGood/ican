// import { useRef, useState } from "react";

export default function ForgotPasswordPage() {
  //   const [email, setEmail] = useState<string>("");
  //   const [page, setPage] = useState<number>(0);

  //   const resetPasswordRef = useRef<HTMLDivElement>(null);
  //   const confirmPasswordRef = useRef<HTMLDivElement>(null);

  //   const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //     setEmail(e.target.value);
  //   };

  return (
    <div
      className={`flex justify-center items-center w-screen h-screen bg-cover bg-no-repeat bg-[url('/assets/Background.svg')] font-quantico`}
    >
      <div className="bg-white p-16 rounded-[64px] flex flex-col gap-y-12 w-fit h-fit">
        <div className="flex flex-col gap-y-4 items-center w-[675px]">
          <div className="text-[#FFF] text-stroke-3 text-[64px]/[64px] font-bold [text-shadow:_4px_4px_0px_#7D83B2] [-webkit-text-stroke-color:_var(--iCAN-Blue---300_#2C3694)]">
            Forgot Password
          </div>
          <div className="text-black text-center text-4xl/9 font-bold">
            Please enter the email associated with your account.
          </div>
        </div>
        <div>
          <input
            className="w-full border-2 border-solid border-[#747474] bg-white px-[10px] py-4 text-black h-16"
            type="text"
            placeholder="Email"
            // onChange={handleEmailChange}
          />
        </div>
        <div className="flex flex-col gap-y-6 w-full h-full">
          <button className="w-full py-3 flex justify-center items-center text-[32px] bg-iCAN-Blue-300">
            Send Code
          </button>
          <div className="flex items-center justify-center w-full">
            <div className="border border-[#626262] w-full" />
            <div className="text-[#626262] px-4">or</div>
            <div className="border border-[#626262] w-full" />
          </div>
          <button
            className="w-full py-3 flex justify-center items-center text-[32px] bg-white gap-y-2.5 border-2 border-solid border-[#000]"
            type="submit"
          >
            <img
              src="/assets/GoogleSocialIcon.svg"
              alt="Google Logo"
              className="w-10 h-10"
            />
            <div className="text-[32px] text-[#000]">Login with Google</div>
          </button>
          <div className="flex justify-center items-center">
            <div className="text-[#626262] text-2xl">
              Don’t have an account?{" "}
              <span className="underline cursor-pointer">Sign Up</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

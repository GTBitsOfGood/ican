import { emailValidation } from "@/utils/validation";
import Image from "next/image";
import { useState } from "react";

const Sections = [
  {
    header: "Forgot Password",
    subheader: "Please enter the email associated with your account.",
  },
  {
    header: "Please check your email",
    subheader: "We’ve sent a code to",
  },
  { header: "Reset password", subheader: "Please enter your new password." },
  {
    header: "Reset password",
    subheader:
      "Password successfully reset. Please use your updated password to login. ",
  },
];

// const ErrorStates = [
//   { 0: "Please enter a valid email address." },
//   { 1: "Please enter a valid OTP." },
//   { 2: "Please enter a valid password." },
// ];

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [otp, setOTP] = useState<string>("");

  const [error, setError] = useState<string>("");

  //   const resetPasswordRef = useRef<HTMLDivElement>(null);
  //   const confirmPasswordRef = useRef<HTMLDivElement>(null);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleOTPChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.length === 1) {
      if (e.target.nextElementSibling) {
        setOTP(otp + e.target.value);
        e.target.nextElementSibling.focus();
      }
    }
  };

  const incPage = () => {
    if (page === 0) {
      if (!emailValidation(email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    setError("");
    setPage((prev) => prev + 1);
  };

  return (
    <div
      className={`flex justify-center items-center w-screen h-screen bg-cover bg-no-repeat bg-[url('/assets/Background.svg')] font-quantico`}
    >
      <div className="bg-white p-16 rounded-[64px] flex flex-col gap-y-6 w-fit h-fit">
        <div className="flex flex-col gap-y-12 items-center w-fit">
          <div className="flex flex-col gap-y-4 items-center">
            <div className="text-[#FFF] text-stroke-3 text-[64px]/[64px] font-bold [text-shadow:_4px_4px_0px_#7D83B2] [-webkit-text-stroke-color:_var(--iCAN-Blue---300_#2C3694)]">
              {Sections[page].header}
            </div>
            <div className="text-black text-center text-4xl/9 font-bold">
              {Sections[page].subheader} {page === 1 && email}
            </div>
          </div>
          <div className="flex flex-col gap-y-2 w-full">
            {page === 0 && (
              <>
                <input
                  className="w-full border-2 border-solid border-[#747474] bg-white px-[10px] py-4 text-black h-16"
                  type="text"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
                {error && (
                  <div className="text-black gap-y-2 flex items-center">
                    <span>
                      <Image src="assets/ErrorIcon.svg" alt="Error Icon" />
                    </span>
                    <p>{error}</p>
                  </div>
                )}
              </>
            )}
            {page === 1 && (
              <div className="flex justify-center gap-x-4">
                {Array(4)
                  .fill("")
                  .map((key: string, idx: number) => {
                    return (
                      <input
                        key={idx}
                        className="w-20 h-20 border border-solid border-[#D8DADC] text-black justify-center items-center text-4xl leading-none"
                        type="text"
                        onChange={handleOTPChange}
                      />
                    );
                  })}
              </div>
            )}
            {page === 2 && (
              <div className="flex flex-col gap-y-9">
                <div className="flex flex-col gap-y-4">
                  <div className="text-2xl text-[#000]">New Password</div>
                  <div>
                    <input
                      className="h-16 px-[10px] py-4 border-2 border-solid border-[#747474] bg-white text-[32px] text-[#626262]"
                      type="password"
                      placeholder="Password"
                    />
                    {error && (
                      <div className="text-black gap-y-2 flex items-center">
                        <span>
                          <Image src="assets/ErrorIcon.svg" alt="Error Icon" />
                        </span>
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="text-2xl text-[#000]">New Password</div>
                  <div>
                    <input
                      className="h-16 px-[10px] py-4 border-2 border-solid border-[#747474] bg-white text-[32px] text-[#626262]"
                      type="password"
                      placeholder="Confirm Passowrd"
                    />
                    {error && (
                      <div className="text-black gap-y-2 flex items-center">
                        <span>
                          <Image src="assets/ErrorIcon.svg" alt="Error Icon" />
                        </span>
                        <p>{error}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            className="w-full py-3 flex justify-center items-center text-[32px] bg-iCAN-Blue-300"
            onClick={incPage}
            type="submit"
          >
            {page === 0
              ? "Send Code"
              : page === 1
                ? "Verify"
                : page === 2
                  ? "Reset Password"
                  : "Login"}
          </button>
          {page === 1 && (
            <div className="flex justify-center">
              {/* Add variable color here when timer goes down to 0 */}
              <p className={`text-[rgba(98,98,98,0.5)] text-[32px]`}>
                Send code again{" "}
                <span className="text-[#626262] text-[32px]">00:59</span>
              </p>
            </div>
          )}
        </div>
        <div className="flex flex-col gap-y-6 w-full h-full">
          <div className="flex items-center justify-center w-full">
            <div className="border border-[#626262] w-full" />
            <div className="text-[#626262] px-4">or</div>
            <div className="border border-[#626262] w-full" />
          </div>
          <button
            className="w-full py-3 flex justify-center items-center text-[32px] bg-white gap-y-2.5 border-2 border-solid border-[#000]"
            type="submit"
          >
            <Image
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

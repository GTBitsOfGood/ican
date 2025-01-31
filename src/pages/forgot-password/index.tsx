import ErrorMessage from "@/components/ErrorMessage";
import {
  emailValidation,
  passwordRequirementsValidation,
} from "@/utils/validation";
import Image from "next/image";
import { useRef, useState } from "react";

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

const ErrorStates = {
  email: "Please enter a valid email address.",
  otp: "Please enter a valid OTP.",
  password: "Must contain at least 6 characters, 1 number, & 1 symbol",
  confirmPassword: "Passwords do not match",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [otp, setOTP] = useState<string>("");

  const [error, setError] = useState<Record<string, string>>({});

  const resetPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

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
    if (!isFormValid()) return;
    setPage((prev) => prev + 1);
  };

  const isFormValid = (): boolean => {
    let isValid = true;

    if (page === 0) {
      if (!emailValidation(email)) {
        isValid = false;
        setError({ email: ErrorStates.email });
      }
    } else if (page === 1) {
      // if (otp.length !== 4) {
      //   isValid = false;
      //   setError({ otp: ErrorStates.otp });
      // }
    } else if (page === 2) {
      const errorObj: { password?: string; confirmPassword?: string } = {};

      if (
        !resetPasswordRef.current?.value ||
        !passwordRequirementsValidation(resetPasswordRef.current?.value)
      ) {
        isValid = false;
        errorObj["password"] = ErrorStates.password;
      }
      if (
        !confirmPasswordRef.current?.value ||
        resetPasswordRef.current?.value !== confirmPasswordRef.current?.value
      ) {
        isValid = false;
        errorObj["confirmPassword"] = ErrorStates.confirmPassword;
      }

      if (!isValid) {
        setError(errorObj);
      }
    }
    return isValid;
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
                  className={`w-full border-2 border-solid ${!error.email ? "border-[#747474] text-[#747474] placeholder:text-[#747474]" : "border-[#CE4E4E] text-[#CE4E4E] placeholder:text-[#CE4E4E]"} bg-white px-[10px] py-4 h-16`}
                  type="text"
                  placeholder="Email"
                  onChange={handleEmailChange}
                />
                {error.email && <ErrorMessage message={error.email} />}
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
                      className={`w-full border-2 border-solid ${!error.password ? "border-[#747474] text-[#747474] placeholder:text-[#747474]" : "border-[#CE4E4E] text-[#CE4E4E] placeholder:text-[#CE4E4E]"} bg-white px-[10px] py-4 h-16`}
                      type="password"
                      placeholder="Password"
                      ref={resetPasswordRef}
                    />
                    {error.password && (
                      <ErrorMessage message={error.password} />
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-y-4">
                  <div className="text-2xl text-[#000]">New Password</div>
                  <div>
                    <input
                      className={`w-full border-2 border-solid ${!error.confirmPassword ? "border-[#747474] text-[#747474] placeholder:text-[#747474]" : "border-[#CE4E4E] text-[#CE4E4E] placeholder:text-[#CE4E4E]"} bg-white px-[10px] py-4 h-16`}
                      type="password"
                      placeholder="Confirm Passowrd"
                      ref={confirmPasswordRef}
                    />
                    {error.confirmPassword && (
                      <ErrorMessage message={error.confirmPassword} />
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
              width={40}
              height={40}
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

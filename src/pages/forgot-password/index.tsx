import ErrorMessage from "@/components/ErrorMessage";
import Timer from "@/components/Timer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { authService } from "@/http/authService";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import {
  emailValidation,
  passwordRequirementsValidation,
} from "@/utils/validation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import Image from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/router";

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
  otp: "Please enter a valid One Time Pin.",
  password: "Must contain at least 6 characters, 1 number, & 1 symbol",
  confirmPassword: "Passwords do not match",
};

const ButtonStates: Record<number, string> = {
  0: "Send Code",
  1: "Verify",
  2: "Reset Password",
  3: "Login",
};

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [userId, setUserId] = useState<string>("");
  const [page, setPage] = useState<number>(0);
  const [otp, setOTP] = useState<string>("");
  const [error, setError] = useState<Record<string, string>>({});
  const [time, setTime] = useState<number>(59);
  const router = useRouter();

  const resetPasswordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const OTPStyles = {
    border: !error.otp ? "1px solid #D8DADC" : "1px solid #CE4E4E",
    width: "80px",
    height: "80px",
    fontSize: "36px",
    color: "#000",
    fontWeight: "700",
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const incPage = async () => {
    if (!isFormValid()) return;

    if (page == 0) {
      try {
        console.log(email);
        const response = await authService.forgotPassword(email);
        if (response.userId) {
          setUserId(response.userId);
        }
      } catch {
        console.log("error found");
        return;
      }
    }

    if (page == 1) {
      try {
        const response = await authService.verifyForgotPassword(userId, otp);
        localStorage.setItem("token", response.token);
      } catch {
        console.log("error found");
        return;
      }
    }

    if (page == 2) {
      try {
        await authService.changePassword(
          resetPasswordRef.current?.value as string,
          confirmPasswordRef.current?.value as string,
        );
        router.push("/");
      } catch {
        console.log("error found");
        return;
      }
    }

    setPage((prev) => prev + 1);
  };

  const isFormValid = (): boolean => {
    console.log("here");
    let isValid = true;
    const errorObj: Record<string, string> = {};

    if (page === 0) {
      if (!emailValidation(email)) {
        isValid = false;
        errorObj["email"] = ErrorStates.email;
      }
    } else if (page === 1) {
      console.log(otp);
      if (otp.length !== 4) {
        isValid = false;
        errorObj["otp"] = ErrorStates.otp;
      }
      console.log(errorObj);
    } else if (page === 2) {
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
    }

    if (!isValid) {
      setError(errorObj);
    }
    return isValid;
  };

  const handleTimerReset = async () => {
    if (time === 0) {
      try {
        await authService.forgotPassword(email);
      } catch {
        console.error("error occured");
        return;
      }

      setTime(59);
    }
  };

  return (
    <UnauthorizedRoute>
      <div
        className={`flex justify-center items-center w-screen h-screen bg-cover bg-no-repeat bg-[url('/assets/Background.svg')]`}
      >
        <div className="bg-white p-16 rounded-[64px] flex flex-col gap-y-6 w-5/12">
          <div className="flex flex-col gap-y-12 items-center font-quantico">
            <div className={`flex flex-col gap-y-4 items-center`}>
              <div className="text-[#FFF] text-[64px]/[64px] font-bold text-shadow-default text-stroke-2 text-stroke-default text-center">
                {Sections[page].header}
              </div>
              <div className="text-black text-center text-4xl/9 font-bold flex flex-wrap">
                {Sections[page].subheader} {page === 1 && email}
              </div>
            </div>

            {page !== 3 && (
              <div className="flex flex-col gap-y-2 w-full">
                {page === 0 && (
                  <>
                    <input
                      className={`w-full border-2 border-solid ${!error.email ? "border-iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 h-16`}
                      type="text"
                      placeholder="Email"
                      onChange={handleEmailChange}
                    />
                    {error.email && <ErrorMessage message={error.email} />}
                  </>
                )}
                {page === 1 && (
                  <div className="flex flex-col items-center justify-center gap-y-4">
                    <InputOTP
                      maxLength={4}
                      onChange={(newValue: string) => setOTP(newValue)}
                      pattern={REGEXP_ONLY_DIGITS}
                    >
                      <InputOTPGroup style={{ gap: "15px" }}>
                        <InputOTPSlot index={0} style={OTPStyles} />
                        <InputOTPSlot index={1} style={OTPStyles} />
                        <InputOTPSlot index={2} style={OTPStyles} />
                        <InputOTPSlot index={3} style={OTPStyles} />
                      </InputOTPGroup>
                    </InputOTP>
                    {error.otp && <ErrorMessage message={error.otp} />}
                  </div>
                )}
                {page === 2 && (
                  <div className="flex flex-col gap-y-9">
                    <div className="flex flex-col gap-y-4">
                      <div className="text-2xl text-[#000]">New Password</div>
                      <div>
                        <input
                          className={`w-full border-2 border-solid ${!error.password ? "border-iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 h-16`}
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
                      <div className="text-2xl text-[#000]">
                        Confirm New Password
                      </div>
                      <div>
                        <input
                          className={`w-full border-2 border-solid ${!error.confirmPassword ? "border--iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 h-16`}
                          type="password"
                          placeholder="Confirm Password"
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
            )}
            <button
              className="w-full py-3 flex justify-center items-center text-[32px] bg-iCAN-Blue-300"
              onClick={incPage}
              type="submit"
            >
              {ButtonStates[page]}
            </button>
            {page === 1 && (
              <div className="flex justify-center font-quantico">
                {/* Add variable color here when timer goes down to 0 */}
                <div
                  className="flex gap-2 items-center"
                  onClick={handleTimerReset}
                >
                  <div
                    className={`${time > 0 ? "text-[rgba(98,98,98,0.5)]" : "text-iCAN-gray cursor-pointer underline hover:text-black"} text-[32px] flex items-center`}
                    onClick={handleTimerReset}
                  >
                    Send code again{" "}
                  </div>
                  <Timer time={time} setTime={setTime} />
                </div>
              </div>
            )}
          </div>
          {page !== 3 && (
            <div className="flex flex-col gap-y-6 w-full h-full font-quantico">
              <div className="flex items-center justify-center w-full">
                <div className="border border-iCAN-gray w-full" />
                <div className="text-iCAN-gray px-4">or</div>
                <div className="border border-iCAN-gray w-full" />
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
                <div className="text-iCAN-gray text-2xl">
                  Don’t have an account?{" "}
                  <span className="underline cursor-pointer">Sign Up</span>
                </div>
              </div>{" "}
            </div>
          )}
        </div>
      </div>
    </UnauthorizedRoute>
  );
}

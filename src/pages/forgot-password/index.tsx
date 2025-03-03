import ErrorBox from "@/components/ErrorBox";
import Timer from "@/components/Timer";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import AuthHTTPClient from "@/http/authHTTPClient";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import {
  emailValidation,
  passwordRequirementsValidation,
} from "@/utils/validation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import Link from "next/link";

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
        const response = await AuthHTTPClient.forgotPassword(email);
        if (response.userId) {
          setUserId(response.userId);
        }
      } catch (error) {
        setError({ email: (error as Error).message });
        return;
      }
    }

    if (page == 1) {
      try {
        const response = await AuthHTTPClient.verifyForgotPassword(userId, otp);
        localStorage.setItem("token", response.token);
      } catch (error) {
        setError({ otp: (error as Error).message });
        return;
      }
    }

    if (page == 2) {
      try {
        await AuthHTTPClient.changePassword(
          resetPasswordRef.current?.value as string,
          confirmPasswordRef.current?.value as string,
        );
        router.push("/");
      } catch (error) {
        setError({ password: `Error! ${(error as Error).message}` });
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
        await AuthHTTPClient.forgotPassword(email);
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
        <div
          className={`bg-white tiny:h-[95%] short:h-[85%] ${page === 0 ? "short:w-auto tall:h-[75%]" : ""} tall:h-[90%] my-2 tablet:px-4 desktop:px-8 short:px-2 overflow-y-auto rounded-[64px] flex flex-col justify-center items-center 2 desktop:gap-y-6 tiny:gap-y-0 tall:gap-y-6 mobile:w-11/12 tablet:w-5/6 desktop:w-2/3 largeDesktop:w-1/2`}
        >
          <div className="flex flex-col desktop:gap-y-12 w-[90%] mobile:gap-y-4 tiny:gap-y-3 short:gap-y-3 mx-2 tall:gap-y-4 items-center font-quantico">
            <div
              className={`flex flex-col mobile:gap-y-2 desktop:gap-y-4 tiny:gap-y-1 short:gap-y-2 tall:gap-y-4 items-center`}
            >
              <div className="text-[#FFF] mobile:text-3xl tiny:text-xl short:text-3xl desktop:text-[40px]/[48px] font-bold text-shadow-default short:text-stroke-1 mobile:text-stroke-1 desktop:text-stroke-2 text-stroke-default text-center">
                {Sections[page].header}
              </div>
              <div className="text-black text-center mobile:text-xl short:text-xl tablet:text-[28px] font-bold flex flex-wrap">
                {Sections[page].subheader} {page === 1 && email}
              </div>
            </div>

            {page !== 3 && (
              <div className="flex flex-col gap-y-2 w-[90%]">
                {page === 0 && (
                  <>
                    <input
                      className={`border-2 border-solid mobile:h-10 short:h-10 tablet:h-12 desktop:h-16 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] ${!error.email ? "border-iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 mobile:h-12 desktop:h-16`}
                      type="text"
                      placeholder="Email"
                      onChange={handleEmailChange}
                    />
                    {error.email && <ErrorBox message={error.email} />}
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
                    {error.otp && <ErrorBox message={error.otp} />}
                  </div>
                )}
                {page === 2 && (
                  <div className="flex flex-col tiny:gap-y-1 short:gap-y-2 mobile:gap-y-2 desktop:gap-y-5">
                    <div className="flex flex-col mobile:gap-y-2 short:gap-y-1 desktop:gap-y-4">
                      <div className="mobile:text-lg short:text-lg desktop:text-2xl text-[#000]">
                        New Password
                      </div>
                      <div>
                        <input
                          className={`w-full border-2 border-solid mobile:h-10 short:h-10 tablet:h-12 desktop:h-16 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] ${!error.password ? "border-iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 mobile:h-12 desktop:h-16`}
                          type="password"
                          placeholder="Password"
                          ref={resetPasswordRef}
                        />
                        {error.password && (
                          <ErrorBox message={error.password} />
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col mobile:gap-y-2 short:gap-y-1 desktop:gap-y-4">
                      <div className="mobile:text-lg short:text-lg desktop:text-2xl text-[#000]">
                        Confirm New Password
                      </div>
                      <div>
                        <input
                          className={`w-full border-2 border-solid mobile:h-10 short:h-10 tablet:h-12 desktop:h-16 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] ${!error.confirmPassword ? "border-iCAN-textfield text-iCAN-textfield placeholder:text-iCAN-textfield" : "border-iCAN-error text-iCAN-error placeholder:text-iCAN-error"} bg-white px-[10px] py-4 mobile:h-12 desktop:h-16`}
                          type="password"
                          placeholder="Confirm Password"
                          ref={confirmPasswordRef}
                        />
                        {error.confirmPassword && (
                          <ErrorBox message={error.confirmPassword} />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
            <button
              className="w-[90%] mobile:py-2 desktop:py-3 tiny:py-2 short:py-2 tall:py-3 flex justify-center items-center tablet:h-12 mobile:h-8 short:h-8 tablet:text-[24px]/[32px] short:text-[16px] mobile:text-[16px] bg-iCAN-Blue-300"
              onClick={incPage}
              type="submit"
            >
              {ButtonStates[page]}
            </button>
            {page === 1 && (
              <div className="flex justify-center font-quantico mobile:text-xl short:text-xl tablet:text-[28px]">
                {/* Add variable color here when timer goes down to 0 */}
                <div
                  className="flex gap-2 items-center mobile:text-xl short:text-xl tablet:text-[28px]"
                  onClick={handleTimerReset}
                >
                  <div
                    className={`${time > 0 ? "text-[rgba(98,98,98,0.5)]" : "text-iCAN-gray cursor-pointer underline hover:text-black"} mobile:text-xl short:text-xl tablet:text-[28px] flex items-center`}
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
            <div className="flex flex-col mobile:gap-y-2 short:gap-y-1 desktop:gap-y-3 tiny:gap-y-0 w-[80%] h-auto font-quantico">
              <div className="flex items-center justify-center w-full">
                <div className="border border-iCAN-gray w-full" />
                <div className="text-iCAN-gray px-4">or</div>
                <div className="border border-iCAN-gray w-full" />
              </div>
              <GoogleLoginButton forgotPassword={true} />
              <div className="flex justify-center items-center">
                <div className="text-textGrey mobile:text-lg short:text-lg tiny:text-[16px] desktop:text-[20px] short:text-lg">
                  Don’t have an account?{" "}
                  <Link href="/register" className="underline self-center">
                    Sign Up
                  </Link>
                </div>
              </div>{" "}
            </div>
          )}
        </div>
      </div>
    </UnauthorizedRoute>
  );
}

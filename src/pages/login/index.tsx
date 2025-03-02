import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { emailIsValid, passwordIsValid } from "@/utils/validation";
import { authService } from "@/http/authService";
import ErrorBox from "@/components/ErrorBox";
import { useRouter } from "next/router";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { getStatusCode } from "@/types/exceptions";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errorDetected = false;

    if (!emailIsValid(email.trim())) {
      setEmailError("Please enter a valid email.");
      errorDetected = true;
    } else {
      setEmailError("");
    }
    if (!passwordIsValid(password.trim())) {
      setPasswordError(
        "Password must contain at least 6 characters, 1 number, & 1 symbol.",
      );
      errorDetected = true;
    } else {
      setPasswordError("");
    }

    if (errorDetected) {
      return errorDetected;
    }

    setLoggingIn(true);
    try {
      const response = await authService.login(email.trim(), password.trim());
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (error) {
      if (error instanceof Error && getStatusCode(error) == 400) {
        setPasswordError((error as Error).message);
        setEmailError("");
      }
    } finally {
      setLoggingIn(false);
    }

    return errorDetected;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  return (
    <UnauthorizedRoute>
      <div className="flex h-screen font-quantico bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] py-2">
        <div
          className={`self-center flex flex-col overflow-y-auto items-center justify-center rounded-[64px] mobile:w-[85%] minimized:w-[65%] short:w-[55%] tablet:w-[65%] largeDesktop:w-[50%] bg-white ${loggingIn ? "h-auto" : "h-full"} mx-auto my-auto`}
        >
          <Image
            className="desktop:mb-2 mobile:mb-0 minimized:mb-0 tablet:w-[165px] tablet:h-[111px] minimized:w-[165px] minimized:h-[111px] tiny:w-[83px] tiny:h-[56px] desktop:w-[248px] desktop:h-[167px]"
            src="/icanLogo.svg"
            alt="Logo"
            width={248}
            height={167}
          />
          <div className="self-center w-[80%] mobile:my-1 minimized:mb-1 desktop:my-4 text-center text-black mobile:text-xl tiny:text-lg minimized:text-xl tablet:text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
            Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
          </div>
          {loggingIn ? (
            <div className="flex justify-between space-between items-center text-white text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
              LOGGING IN
              <Image
                className="ml-3 spin"
                src="/loading.svg"
                alt="loading"
                width={60}
                height={60}
              />
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-[80%] bg-white rounded-lg"
              >
                <div className="text-white self-start mobile:text-3xl tiny:text-xl minimized:text-2xl desktop:text-[32px]/[40px] font-bold text-shadow-default mobile:text-stroke-1 minimized:text-stroke-1 desktop:text-stroke-2 text-stroke-default mobile:mb-1 minimized:mb-1 tablet:mb-4">
                  Log In
                </div>
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg tablet:text-[24px]/[32px] tablet:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <ErrorBox message={emailError} />
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey short:mb-1 desktop:mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg tablet:text-[24px]/[32px] tablet:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <ErrorBox message={passwordError} />
                <p className="text-textGrey self-start font-berlin-sans text-[20px] font-normal decoration-solid mb-2 [text-decoration-skip-ink:none]">
                  <Link
                    className=" desktop:text-2xl mobile:text-lg short:text-lg tiny:text-[16px] underline"
                    href="/forgot-password"
                  >
                    Forgot Password?
                  </Link>
                </p>
                <button
                  className="w-full bg-loginGreen text-black desktop:h-12 mobile:h-8 short:h-8 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] text-center mb-4"
                  type="submit"
                >
                  Login
                </button>
              </form>
              <div className="flex flex-col mobile:gap-y-1 short:gap-y-1 desktop:gap-y-6 w-[80%]">
                <div className="flex items-center justify-center w-full">
                  <div className="border border-textGrey w-full" />
                  <div className="text-textGrey px-4">or</div>
                  <div className="border border-textGrey w-full" />
                </div>
                <GoogleLoginButton setError={setEmailError} />
              </div>
              <div className="text-textGrey mobile:text-lg short:text-lg tiny:text-[16px] desktop:text-[20px] short:text-lg">
                Don&apos;t have an account?{" "}
                <Link className="underline" href="/register">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </UnauthorizedRoute>
  );
}

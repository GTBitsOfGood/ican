import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  nameIsValid,
  emailIsValid,
  passwordIsValid,
} from "../../utils/validation";
import ErrorBox from "@/components/ErrorBox";
import AuthHTTPClient from "@/http/authHTTPClient";
import { useRouter } from "next/router";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { getStatusCode } from "@/types/exceptions";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errorDetected = false;

    // Clear all errors first
    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setGeneralError("");

    if (!nameIsValid(name.trim())) {
      setNameError("Please enter a valid name.");
      errorDetected = true;
    }

    if (!emailIsValid(email.trim())) {
      setEmailError("Please enter a valid email.");
      errorDetected = true;
    }

    if (!passwordIsValid(password.trim())) {
      setPasswordError(
        "Must contain at least 6 characters, 1 number, & 1 symbol.",
      );
      errorDetected = true;
    }

    if (
      confirmPassword.trim() !== password.trim() ||
      !passwordIsValid(confirmPassword.trim())
    ) {
      setConfirmPasswordError("Passwords do not match.");
      errorDetected = true;
    }

    if (errorDetected) {
      return errorDetected;
    }

    setRegistering(true);
    try {
      await AuthHTTPClient.register(
        name.trim(),
        email.trim(),
        password.trim(),
        confirmPassword.trim(),
      );
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = getStatusCode(error);

        if (statusCode === 409) {
          setEmailError("An account with this email already exists.");
        } else if (statusCode === 400) {
          setGeneralError("Please check your information and try again.");
        } else {
          setGeneralError("An error occurred. Please try again.");
        }
      }
    } finally {
      setRegistering(false);
    }

    return errorDetected;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
    setGeneralError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
    setGeneralError("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
    setGeneralError("");
  };

  return (
    <UnauthorizedRoute>
      <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-2">
        <div
          className={`self-center flex flex-col font-quantico items-center justify-center rounded-[64px] mobile:w-[85%] tiny:w-[80%] minimized:w-[65%] short:w-[55%] desktop:w-[50%] bg-white ${registering ? "h-auto" : "h-full"} mx-auto overflow-scroll`}
        >
          <Image
            className="desktop:mb-1 mobile:mb-0 minimized:mb-0 mobile:w-[165px] mobile:h-[111px] minimized:w-[165px] minimized:h-[111px] tiny:w-[83px] tiny:h-[56px] desktop:w-[248px] desktop:h-[167px]"
            src="/icanLogo.svg"
            alt="Logo"
            width={248}
            height={167}
          />

          {!registering && (
            <div className="self-center w-[80%] mobile:my-1 minimized:mb-1 desktop:my-4 text-center text-black mobile:text-xl tiny:text-lg minimized:text-xl tablet:text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
              Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
            </div>
          )}
          {registering ? (
            <div className="flex justify-center items-center text-white text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
              CREATING ACCOUNT
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
                className="flex flex-col items-center justify-between w-[80%] bg-white rounded-lg"
              >
                <div className="text-white self-start mobile:text-3xl tiny:text-xl minimized:text-3xl desktop:text-[32px]/[40px] font-bold text-shadow-default mobile:text-stroke-1 minimized:text-stroke-1 desktop:text-stroke-2 text-stroke-default mobile:mb-2 minimized:mb-1 desktop:mb-2">
                  Sign Up
                </div>
                {generalError && (
                  <div className="self-start w-full mb-2">
                    <ErrorBox message={generalError} />
                  </div>
                )}
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${nameError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg desktop:text-[24px]/[32px] desktop:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                />
                <ErrorBox message={nameError} />
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg desktop:text-[24px]/[32px] desktop:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <ErrorBox message={emailError} />
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg desktop:text-[24px]/[32px] desktop:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <ErrorBox message={passwordError} />
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${confirmPasswordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg desktop:text-[24px]/[32px] desktop:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <ErrorBox message={confirmPasswordError} />
                <button
                  className="w-full bg-[#2C3694] text-white desktop:h-12 mobile:h-8 short:h-8 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] text-center mobile:mb-1 short:mb-1 tablet:mb-2 desktop:mb-4"
                  type="submit"
                >
                  Sign Up
                </button>
                <div className="flex flex-col mobile:gap-y-1 short:gap-y-1 tablet:gap-y-3 w-[80%]">
                  <div className="flex items-center justify-center w-full">
                    <div className="border border-textGrey w-full" />
                    <div className="text-textGrey px-4">or</div>
                    <div className="border border-textGrey w-full" />
                  </div>
                  <GoogleLoginButton setError={setGeneralError} />
                </div>
                <div className="text-textGrey mobile:text-lg short:text-lg tiny:text-[16px] desktop:text-[20px] short:text-lg">
                  Have an account?{" "}
                  <Link className="underline font-quantico" href="/login">
                    Login
                  </Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </UnauthorizedRoute>
  );
}

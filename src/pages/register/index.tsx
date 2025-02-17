import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  nameIsValid,
  emailIsValid,
  passwordIsValid,
} from "../../utils/validation";
import ErrorBox from "@/components/ErrorBox";
import { authService } from "@/http/authService";
import { useRouter } from "next/router";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { ApiError } from "@/types/exceptions";

export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registering, setRegistering] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errorDetected = false;

    if (!nameIsValid(name.trim())) {
      setNameError("Please enter a valid name.");
      errorDetected = true;
    } else {
      setNameError("");
    }

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

    if (
      confirmPassword.trim() !== password.trim() ||
      !passwordIsValid(confirmPassword.trim())
    ) {
      setConfirmPasswordError("Passwords do not match.");
      errorDetected = true;
    } else {
      setConfirmPasswordError("");
    }

    if (errorDetected) {
      return errorDetected;
    }

    setRegistering(true);
    try {
      const response = await authService.register(
        name.trim(),
        email.trim(),
        password.trim(),
        confirmPassword.trim(),
      );
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (error) {
      if (error instanceof ApiError && error.statusCode == 400) {
        setPasswordError((error as Error).message);
        setEmailError("");
      } else {
        setEmailError((error as Error).message);
        setPasswordError("");
      }
    } finally {
      setRegistering(false);
    }

    return errorDetected;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    setNameError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
  };

  const handleConfirmPasswordChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setConfirmPassword(e.target.value);
    setConfirmPasswordError("");
  };

  return (
    <UnauthorizedRoute>
      <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-2">
        <div
          className={`self-center flex flex-col font-quantico items-center justify-center rounded-[64px] mobile:w-[70%] desktop:w-[45%] bg-white ${registering ? "h-auto" : "h-full"} mx-auto overflow-scroll`}
        >
          <Image
            className="mb-4"
            src="/icanLogo.svg"
            alt="Logo"
            width={248}
            height={167}
          />

          {registering ? (
            <div className="self-center w-[80%] my-4 text-center text-black text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
              Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
              <div className="flex justify-center items-center text-white self-start text-[36px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
                <p className="mr-4">CREATING ACCOUNT</p>
                <Image
                  className="spin"
                  src="/loading.svg"
                  alt="loading"
                  width={50}
                  height={50}
                />
              </div>
            </div>
          ) : (
            <>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-between w-[80%] bg-white rounded-lg"
              >
                <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default font-quantico mb-2">
                  Sign Up
                </div>
                <input
                  className={`flex h-16 px-4 items-center gap-[5px] ${nameError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={name}
                  onChange={handleNameChange}
                />
                <ErrorBox message={nameError} />
                <input
                  className={`flex h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <ErrorBox message={emailError} />
                <input
                  className={`flex h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <ErrorBox message={passwordError} />
                <input
                  className={`flex h-16 px-4 items-center gap-[5px] ${confirmPasswordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                  type="password"
                  placeholder="Confirm Password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                />
                <ErrorBox message={confirmPasswordError} />
                <button
                  className="w-full bg-[#2C3694] text-[24px]/[32px] text-white h-12 font-quantico mb-4"
                  type="submit"
                >
                  Sign Up
                </button>
                <div className="flex flex-col gap-y-6 w-[80%]">
                  <div className="flex items-center justify-center w-full">
                    <div className="border border-textGrey w-full" />
                    <div className="text-textGrey px-4">or</div>
                    <div className="border border-textGrey w-full" />
                  </div>
                  <GoogleLoginButton setError={setEmailError} />
                </div>
                <div className="text-textGrey font-quantico text-[20px]">
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

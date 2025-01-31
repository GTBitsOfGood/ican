import Image from "next/image";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function Home() {
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errorDetected = false;
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    if (data.name.trim() === "") {
      setNameError("Please enter a valid name");
      errorDetected = true;
    }

    if (data.email.trim() === "" || !data.email.includes("@")) {
      setEmailError("Please enter a valid email");
      errorDetected = true;
    }

    if (!passwordIsValid(data.password.trim())) {
      setPasswordError(
        "Must contain at least 6 characters, 1 number, and 1 symbol",
      );
      errorDetected = true;
    }

    if (data.confirmPassword.trim() !== data.password.trim()) {
      setConfirmPasswordError("Passwords do not match");
    } else if (!passwordIsValid(data.confirmPassword.trim())) {
      setConfirmPasswordError(
        "Must contain at least 6 characters, 1 number, and 1 symbol",
      );
      errorDetected = true;
    }

    if (!errorDetected) {
      setRegistering(true);
    }
  };

  const passwordIsValid = (password: string) => {
    return (
      password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password)
    );
  };

  return (
    <div className="flex h-screen bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] p-2">
      <div
        className={`self-center flex flex-col font-quantico items-center justify-center rounded-[64px] w-[45%] bg-white ${registering ? "h-auto" : "h-full"} mx-auto overflow-scroll`}
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
            <div className="flex justify-between items-center text-white self-start text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
              CREATING ACCOUNT
              <Image src="/loading.svg" alt="loading" width={60} height={60} />
            </div>
          </div>
        ) : (
          <>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-center justify-between w-[80%] bg-white rounded-lg"
            >
              <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default font-quantico mb-2">
                Sign up
              </div>
              <input
                className={`flex h-16 px-4 items-center gap-[5px] ${nameError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                type="text"
                name="name"
                placeholder="Name"
              />
              {nameError !== "" ? (
                <span className="flex self-start text-black mb-2">
                  <WarningCircle className="self-center mr-2" size={16} />{" "}
                  {nameError}
                </span>
              ) : (
                <></>
              )}
              <input
                className={`flex h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                type="email"
                placeholder="Email"
                name="email"
              />
              {emailError !== "" ? (
                <span className="flex self-start text-black mb-2">
                  <WarningCircle className="self-center mr-2" size={16} />{" "}
                  {emailError}
                </span>
              ) : (
                <></>
              )}
              <input
                className={`flex h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                type="password"
                placeholder="Password"
                name="password"
              />
              {passwordError !== "" ? (
                <span className="flex self-start text-black mb-2">
                  <WarningCircle className="self-center mr-2" size={16} />{" "}
                  {passwordError}
                </span>
              ) : (
                <></>
              )}
              <input
                className={`flex h-16 px-4 items-center gap-[5px] ${confirmPasswordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                type="password"
                placeholder="Confirm Password"
                name="confirmPassword"
              />
              {confirmPasswordError !== "" ? (
                <span className="flex self-start text-black mb-2">
                  <WarningCircle className="self-center mr-2" size={16} />{" "}
                  {confirmPasswordError}
                </span>
              ) : (
                <></>
              )}
              <button
                className="w-full bg-[#2C3694] text-[24px]/[32px] text-white h-12 font-quantico mb-4"
                type="submit"
              >
                Sign up
              </button>
              <div className="flex flex-col gap-y-6 w-full">
                <div className="flex items-center justify-center w-full">
                  <div className="border border-textGrey w-full" />
                  <div className="text-textGrey px-4">or</div>
                  <div className="border border-textGrey w-full" />
                </div>
                <button
                  className="w-full gap-y-2.5 border-2 flex py-3 justify-center items-center border-solid border-[#000] bg-white text-black h-12 text-[24px]/[32px] text-center mb-4"
                  type="button"
                >
                  <Image
                    src="/GoogleSocialIcon.svg"
                    alt="Google Logo"
                    width={30}
                    height={30}
                  />
                  <div className="px-3 text-[24px]/[32px] text-[#000]">
                    Sign Up with Google
                  </div>
                </button>
              </div>
              <div className="text-textGrey font-quantico">
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
  );
}

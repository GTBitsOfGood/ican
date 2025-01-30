import Image from "next/image";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function Home() {
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    };

    if (data.name.trim() === "") {
      setNameError("Please enter a valid name");
    }
    if (data.email.trim() === "" || !data.email.includes("@")) {
      setEmailError("Please enter a valid email");
    }
    if (!passwordIsValid(data.password.trim())) {
      setPasswordError(
        "Must contain at least 6 characters, 1 number, and 1 symbol",
      );
    }
    if (data.confirmPassword.trim() !== data.password.trim()) {
      setConfirmPasswordError("Passwords do not match");
    }
    alert(JSON.stringify(data));
  };

  const passwordIsValid = (password: string) => {
    return (
      password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password)
    );
  };

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

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-between w-[80%] h-[65%] bg-white rounded-lg"
        >
          <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default">
            Sign up
          </div>
          <input
            className={`flex h-16 px-4 items-center gap-[5px] ${nameError === "" ? "text-textGrey placeholder-textGrey border-borderGrey" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
            type="text"
            name="name"
            placeholder="Name"
          />
          {nameError !== "" ? (
            <span className="flex self-start text-black mb-4">
              <WarningCircle className="self-center mr-2" size={16} />{" "}
              {nameError}
            </span>
          ) : (
            <></>
          )}
          <input
            className={`flex h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
            type="email"
            placeholder="Email"
            name="email"
          />
          {emailError !== "" ? (
            <span className="flex self-start text-black mb-4">
              <WarningCircle className="self-center mr-2" size={16} />{" "}
              {emailError}
            </span>
          ) : (
            <></>
          )}
          <input
            className={`flex h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
            type="password"
            placeholder="Password"
            name="password"
          />
          {passwordError !== "" ? (
            <span className="flex self-start text-black mb-4">
              <WarningCircle className="self-center mr-2" size={16} />{" "}
              {passwordError}
            </span>
          ) : (
            <></>
          )}
          <input
            className={`flex h-16 px-4 items-center gap-[5px] ${confirmPasswordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
          />
          {confirmPasswordError !== "" ? (
            <span className="flex self-start text-black mb-4">
              <WarningCircle className="self-center mr-2" size={16} />{" "}
              {confirmPasswordError}
            </span>
          ) : (
            <></>
          )}
          <button className="w-full bg-[#2C3694] text-white h-12" type="submit">
            Sign up
          </button>
          <div className="text-[#626262]">
            Have an account?{" "}
            <Link className="underline" href="/login">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

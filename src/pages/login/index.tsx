import Image from "next/image";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function Home() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    if (data.email.trim() === "" || !data.email.includes("@")) {
      setEmailError("Please enter a valid email");
    }
    if (data.password.trim() === "") {
      setPasswordError("Please enter a valid password");
    }
    alert(JSON.stringify(data));
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
        <div className="self-center w-[80%] my-4 text-left text-black text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
          Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-between w-[80%] h-[45%] bg-white rounded-lg"
        >
          <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default">
            Log in
          </div>
          <input
            className={`flex h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
            type="text"
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
          <p className="text-textGrey self-start font-berlin-sans text-[24px] font-normal underline decoration-solid [text-decoration-skip-ink:none]">
            Forgot Password
          </p>
          <button
            className="w-full bg-loginGreen text-black h-12"
            type="submit"
          >
            Login
          </button>
        </form>
        <div className="text-textGrey">
          Don&apos;t have an account?{" "}
          <Link className="underline" href="/register">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}

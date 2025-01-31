import Image from "next/image";
import Link from "next/link";
import { WarningCircle } from "@phosphor-icons/react";
import { useState } from "react";

export default function Home() {
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [registering, setRegistering] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };
    let errorDetected = false;
    if (data.email.trim() === "" || !data.email.includes("@")) {
      setEmailError("Please enter a valid email");
      errorDetected = true;
    } else {
      setEmailError("");
    }
    if (data.password.trim() === "" || !passwordIsValid(data.password.trim())) {
      setPasswordError(
        "Must contain at least 6 characters, 1 number, and 1 symbol",
      );
      errorDetected = true;
    } else {
      setPasswordError("");
    }
    if (!errorDetected) {
      setRegistering(true);
    }
    alert(JSON.stringify(data));
  };

  const passwordIsValid = (password: string) => {
    return (
      password.length >= 6 && /\d/.test(password) && /[!@#$%^&*]/.test(password)
    );
  };

  return (
    <div className="flex h-screen font-quantico bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] py-2">
      <div
        className={`self-center flex flex-col items-center justify-center rounded-[64px] w-2/5 bg-white ${registering ? "h-auto" : "h-full"} mx-auto overflow-scroll`}
      >
        <Image
          className="mb-4"
          src="/icanLogo.svg"
          alt="Logo"
          width={248}
          height={167}
        />
        <div className="self-center w-[80%] my-4 text-center text-black text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
          Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
        </div>
        {registering ? (
          <div className="flex justify-between space-between items-center text-white text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
            LOGGING IN
            <Image
              className="ml-3"
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
              className="flex flex-col items-center justify-between w-[80%] h-[45%] bg-white rounded-lg"
            >
              <div className="text-white self-start text-[32px]/[40px] font-bold text-shadow-default text-stroke-2 text-stroke-default mb-4">
                Log in
              </div>
              <input
                className={`flex h-16 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
                type="text"
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
                className={`flex h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-6" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] self-stretch border-2 bg-white`}
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
              <p className="text-textGrey self-start font-berlin-sans text-[16px] font-normal underline decoration-solid mb-2 [text-decoration-skip-ink:none]">
                Forgot Password?
              </p>
              <button
                className="w-full bg-loginGreen text-black h-12 text-[24px]/[32px] text-center mb-4"
                type="submit"
              >
                Login
              </button>
            </form>
            <div className="flex flex-col gap-y-6 w-[80%]">
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
                  Login with Google
                </div>
              </button>
            </div>
            <div className="text-textGrey">
              Don&apos;t have an account?{" "}
              <Link className="underline" href="/register">
                Sign up
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

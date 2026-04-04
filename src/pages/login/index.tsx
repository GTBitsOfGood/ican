import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { emailIsValid, passwordIsValid } from "@/utils/validation";
import AuthHTTPClient from "@/http/authHTTPClient";
import ErrorBox from "@/components/ErrorBox";
import { useRouter } from "next/router";
import UnauthorizedRoute from "@/components/UnauthorizedRoute";
import GoogleLoginButton from "@/components/GoogleLoginButton";
import { getStatusCode } from "@/types/exceptions";
import {
  ChildPasswordType,
  LoginType,
  isPatternChildPasswordType,
} from "@/types/user";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";

export default function Home() {
  const childPasswordIncorrectMessage =
    "Oh no! The password is incorrect. Please try again.";
  const [loginType, setLoginType] = useState<LoginType>(LoginType.PARENT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [childPasswordType, setChildPasswordType] =
    useState<ChildPasswordType | null>(null);
  const [childColorSequence, setChildColorSequence] = useState<string[]>([]);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [generalError, setGeneralError] = useState("");
  const [loggingIn, setLoggingIn] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const childPassword = childColorSequence.join("-");
  const isChildLogin = loginType === LoginType.CHILD;
  const isChildPasswordStep = isChildLogin && !!childPasswordType;
  const isPatternChildLogin = isPatternChildPasswordType(childPasswordType);
  const modalLoginDisabled = isPatternChildLogin
    ? childColorSequence.length < 4
    : !/^\d{4}$/.test(password.trim());

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let errorDetected = false;

    setEmailError("");
    setPasswordError("");
    setGeneralError("");

    if (!emailIsValid(email.trim())) {
      setEmailError("Please enter a valid email.");
      errorDetected = true;
    }

    if (!isChildLogin) {
      if (!passwordIsValid(password.trim())) {
        setPasswordError("Password incorrect, please check again.");
        errorDetected = true;
      }
    } else if (isChildPasswordStep) {
      if (isPatternChildLogin && childColorSequence.length < 4) {
        setPasswordError("Please enter 4 selections.");
        errorDetected = true;
      }

      const candidatePassword = isPatternChildLogin
        ? childPassword
        : password.trim();

      if (!isPatternChildLogin && !/^\d{4}$/.test(candidatePassword)) {
        setPasswordError("Please enter a valid 4-digit PIN.");
        errorDetected = true;
      }
    }

    if (errorDetected) {
      return errorDetected;
    }

    setLoggingIn(true);
    try {
      if (isChildLogin && !isChildPasswordStep) {
        const { childPasswordType } = await AuthHTTPClient.getChildPasswordType(
          email.trim(),
        );
        setChildPasswordType(childPasswordType);
        setPassword("");
        setChildColorSequence([]);
        return false;
      }

      const candidatePassword = isPatternChildLogin
        ? childPassword
        : password.trim();
      await AuthHTTPClient.login(
        email.trim(),
        candidatePassword,
        loginType,
        rememberMe,
      );
      router.push("/");
    } catch (error) {
      if (error instanceof Error) {
        const statusCode = getStatusCode(error);

        if (statusCode === 404) {
          if (isChildLogin && !isChildPasswordStep) {
            setGeneralError("No child login found for this account.");
          } else {
            setGeneralError(
              "We couldn't find an account with this email. Try again or Sign Up.",
            );
          }
        } else if (statusCode === 401 || statusCode === 400) {
          if (isChildLogin && isChildPasswordStep) {
            setPasswordError(childPasswordIncorrectMessage);
          } else {
            setPasswordError("Password incorrect, please check again.");
          }
        } else {
          setGeneralError(
            "Oh no! The password is incorrect. Please try again.",
          );
        }
      }
    } finally {
      setLoggingIn(false);
    }

    return errorDetected;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setEmailError("");
    setChildPasswordType(null);
    setChildColorSequence([]);
    setGeneralError("");
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setPasswordError("");
    setGeneralError("");
  };

  const handleLoginTypeChange = (newLoginType: LoginType) => {
    setLoginType(newLoginType);
    setPassword("");
    setPasswordError("");
    setGeneralError("");
    setChildPasswordType(null);
    setChildColorSequence([]);
  };

  const closeChildPasswordModal = () => {
    setChildPasswordType(null);
    setPassword("");
    setChildColorSequence([]);
    setPasswordError("");
    setGeneralError("");
  };

  return (
    <UnauthorizedRoute>
      <div className="flex min-h-screen overflow-y-auto font-quantico bg-cover bg-no-repeat bg-[url('/LoginBackground.svg')] py-2">
        <div className="self-center flex flex-col items-center justify-center rounded-[64px] mobile:w-[85%] minimized:w-[65%] short:w-[55%] tablet:w-[65%] largeDesktop:w-[50%] bg-white h-auto mx-auto my-auto mobile:pt-3 mobile:pb-2 desktop:pt-4 desktop:pb-3">
          <Image
            className="desktop:mb-2 mobile:mb-0 minimized:mb-0 tablet:w-[165px] tablet:h-[111px] minimized:w-[165px] minimized:h-[111px] tiny:w-[83px] tiny:h-[56px] desktop:w-[220px] desktop:h-[148px]"
            src="/icanLogo.svg"
            alt="Logo"
            width={248}
            height={167}
          />
          {!loggingIn && (
            <div className="self-center w-[80%] mobile:my-1 minimized:mb-1 desktop:my-3 text-center text-black mobile:text-xl tiny:text-lg minimized:text-xl tablet:text-[26px] font-bold leading-[36px] tracking-[-1.44px]">
              Adopt & Care for a Supportive Pet Pal for Your Medication Journey!
            </div>
          )}
          {loggingIn ? (
            <div className="flex justify-center items-center text-white text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
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
                id="login-form"
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-[80%] bg-white rounded-lg"
              >
                {generalError && (
                  <div className="self-start w-full mb-2">
                    <ErrorBox message={generalError} />
                  </div>
                )}
                <div className="w-full mb-2 flex border-2 border-borderGrey">
                  <button
                    type="button"
                    className={`w-1/2 py-2 text-lg ${loginType === LoginType.PARENT ? "bg-loginGreen text-black" : "bg-white text-textGrey"}`}
                    onClick={() => handleLoginTypeChange(LoginType.PARENT)}
                  >
                    Parent Login
                  </button>
                  <button
                    type="button"
                    className={`w-1/2 py-2 text-lg ${loginType === LoginType.CHILD ? "bg-loginBlue text-white" : "bg-white text-textGrey"}`}
                    onClick={() => handleLoginTypeChange(LoginType.CHILD)}
                  >
                    Child Login
                  </button>
                </div>
                <div className="text-white self-start mobile:text-3xl tiny:text-xl minimized:text-2xl desktop:text-[30px]/[38px] font-bold text-shadow-default mobile:text-stroke-1 minimized:text-stroke-1 desktop:text-stroke-2 text-stroke-default mobile:mb-1 minimized:mb-1 tablet:mb-3">
                  Log In
                </div>
                <input
                  className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-14 px-4 items-center gap-[5px] ${emailError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg tablet:text-[24px]/[32px] tablet:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                  type="text"
                  placeholder="Email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                />
                <ErrorBox message={emailError} />
                {!isChildLogin ? (
                  <input
                    className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-14 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey short:mb-1 desktop:mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg tablet:text-[24px]/[32px] tablet:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                    type="password"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                ) : null}
                <ErrorBox message={passwordError} />
                {!isChildLogin && (
                  <p className="text-textGrey self-start font-berlin-sans text-[20px] font-normal decoration-solid mb-2 [text-decoration-skip-ink:none]">
                    <Link
                      className=" desktop:text-xl mobile:text-lg short:text-lg tiny:text-[16px] underline"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                )}
                <button
                  className="w-full bg-loginGreen text-black desktop:h-11 mobile:h-8 short:h-8 desktop:text-[22px]/[30px] short:text-lg tiny:text-[16px] mobile:text-[16px] text-center mb-4"
                  type="submit"
                >
                  {isChildLogin && !isChildPasswordStep ? "Continue" : "Login"}
                </button>

                {!isChildPasswordStep && (
                  <div className="mt-2 flex justify-start flex-row">
                    <input
                      type="checkbox"
                      id="rememberMe"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <label htmlFor="rememberMe" className="text-textGrey">
                      Remember me
                    </label>
                  </div>
                )}
              </form>
              {!isChildLogin && (
                <div className="mt-3 flex flex-col mobile:gap-y-2 short:gap-y-2 desktop:gap-y-6 w-[80%]">
                  <div className="flex items-center justify-center w-full">
                    <div className="border border-textGrey w-full" />
                    <div className="text-textGrey px-4">or</div>
                    <div className="border border-textGrey w-full" />
                  </div>
                  <GoogleLoginButton setError={setGeneralError} />
                </div>
              )}
              <div className="mt-2 mb-2 text-textGrey mobile:text-lg short:text-lg tiny:text-[16px] desktop:text-[20px] short:text-lg">
                Don&apos;t have an account?{" "}
                <Link className="underline" href="/register">
                  Sign up
                </Link>
              </div>
            </>
          )}
        </div>
        {isChildPasswordStep && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
            <div className="relative w-full max-w-[540px] rounded-[40px] bg-white px-8 py-6">
              <button
                type="button"
                aria-label="Close"
                className="absolute right-6 top-4 font-pixelify text-[48px] leading-none text-black"
                onClick={closeChildPasswordModal}
              >
                x
              </button>
              <h2 className="mx-auto w-full max-w-[380px] pr-8 text-center text-[32px]/[32px] font-bold tracking-[-0.04em] text-black">
                Enter your password
              </h2>
              <p className="mx-auto mt-3 w-full max-w-[320px] text-center text-[16px]/[16px] font-normal tracking-[-0.04em] text-black">
                {isPatternChildPasswordType(childPasswordType)
                  ? childPasswordType === ChildPasswordType.SHAPE
                    ? "Select the shapes in the correct order"
                    : childPasswordType === ChildPasswordType.PATTERN
                      ? "Select the patterns in the correct order"
                      : childPasswordType === ChildPasswordType.EMOJI
                        ? "Select the emojis in the correct order"
                        : "Select the colors in the correct order"
                  : "Enter your 4-digit pin"}
              </p>

              <div className="mt-6">
                {isPatternChildLogin ? (
                  <ChildColorPicker
                    sequence={childColorSequence}
                    onAddColor={(token) => {
                      setChildColorSequence((prev) =>
                        prev.length >= 4 ? prev : [...prev, token],
                      );
                      setPasswordError("");
                      setGeneralError("");
                    }}
                    onRemoveColor={(token) => {
                      setChildColorSequence((prev) => {
                        const index = prev.lastIndexOf(token);
                        if (index === -1) return prev;
                        return [
                          ...prev.slice(0, index),
                          ...prev.slice(index + 1),
                        ];
                      });
                      setPasswordError("");
                      setGeneralError("");
                    }}
                    onClear={() => {
                      setChildColorSequence([]);
                      setPasswordError("");
                      setGeneralError("");
                    }}
                    view="login"
                    passwordType={childPasswordType}
                    showInstruction={false}
                  />
                ) : (
                  <input
                    className={`flex h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} text-[24px]/[32px] placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white w-full`}
                    type="password"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="PIN"
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                  />
                )}
              </div>
              {(passwordError || generalError) && (
                <div className="mt-3 px-4 text-center text-[16px]/[20px] text-loginError">
                  {passwordError || generalError}
                </div>
              )}

              <div className="mt-8 flex h-6 items-center justify-center gap-2">
                <input
                  type="checkbox"
                  id="rememberMeModal"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-6 w-6 appearance-none rounded-[4px] border border-black/40 bg-white checked:border-transparent checked:bg-loginCheckboxCheckedBg checked:before:block checked:before:text-center checked:before:text-[18px] checked:before:leading-6 checked:before:text-icanBlue-300 checked:before:content-['✓']"
                />
                <label
                  htmlFor="rememberMeModal"
                  className="text-[16px]/[16px] font-normal tracking-[-0.04em] text-black"
                >
                  Remember me
                </label>
              </div>

              <button
                type="button"
                className={`mx-auto mt-4 flex h-[56px] w-[136px] items-center justify-center text-[24px]/[24px] tracking-[-0.04em] ${!modalLoginDisabled ? "bg-loginGreen text-black" : "bg-loginDisabledBg text-loginDisabledText"}`}
                disabled={modalLoginDisabled}
                onClick={() => {
                  const form = document.getElementById(
                    "login-form",
                  ) as HTMLFormElement | null;
                  form?.requestSubmit();
                }}
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </UnauthorizedRoute>
  );
}

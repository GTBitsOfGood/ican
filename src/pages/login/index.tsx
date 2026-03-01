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
import { ChildPasswordType, LoginType } from "@/types/user";
import ChildColorPicker from "@/components/child-login/ChildColorPicker";

export default function Home() {
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
      const candidatePassword =
        childPasswordType === ChildPasswordType.COLOR
          ? childPassword
          : password.trim();

      if (candidatePassword.length < 3) {
        setPasswordError("Password incorrect, please check again.");
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

      const candidatePassword =
        childPasswordType === ChildPasswordType.COLOR
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
          setPasswordError("Password incorrect, please check again.");
        } else {
          setGeneralError("An error occurred. Please try again.");
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
          {!loggingIn && (
            <div className="self-center w-[80%] mobile:my-1 minimized:mb-1 desktop:my-4 text-center text-black mobile:text-xl tiny:text-lg minimized:text-xl tablet:text-[28px] font-bold leading-[36px] tracking-[-1.44px]">
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
                onSubmit={handleSubmit}
                className="flex flex-col items-center justify-center w-[80%] bg-white rounded-lg"
              >
                <div className="text-white self-start mobile:text-3xl tiny:text-xl minimized:text-2xl desktop:text-[32px]/[40px] font-bold text-shadow-default mobile:text-stroke-1 minimized:text-stroke-1 desktop:text-stroke-2 text-stroke-default mobile:mb-1 minimized:mb-1 tablet:mb-4">
                  Log In
                </div>
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
                    className={`w-1/2 py-2 text-lg ${loginType === LoginType.CHILD ? "bg-loginGreen text-black" : "bg-white text-textGrey"}`}
                    onClick={() => handleLoginTypeChange(LoginType.CHILD)}
                  >
                    Child Login
                  </button>
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
                {!isChildLogin || isChildPasswordStep ? (
                  <>
                    {childPasswordType === ChildPasswordType.COLOR ? (
                      <div className="w-full short:mb-1 desktop:mb-2">
                        <ChildColorPicker
                          sequence={childColorSequence}
                          onAddColor={(token) =>
                            setChildColorSequence((prev) => [...prev, token])
                          }
                          onClear={() => {
                            setChildColorSequence([]);
                            setPasswordError("");
                            setGeneralError("");
                          }}
                          view="login"
                        />
                      </div>
                    ) : (
                      <input
                        className={`flex mobile:h-10 tiny:h-8 short:h-10 tablet:h-12 desktop:h-16 px-4 items-center gap-[5px] ${passwordError === "" ? "text-textGrey placeholder-textGrey border-borderGrey short:mb-1 desktop:mb-2" : "text-errorRed placeholder-errorRed border-errorRed"} mobile:text-lg mobile:placeholder:text-lg short:text-lg short:placeholder:text-lg tablet:text-[24px]/[32px] tablet:placeholder:text-[24px]/[32px] focus:text-textGrey focus:placeholder-textGrey focus:border-borderGrey self-stretch border-2 bg-white`}
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={handlePasswordChange}
                      />
                    )}
                  </>
                ) : null}
                <ErrorBox message={passwordError} />
                {!isChildLogin && (
                  <p className="text-textGrey self-start font-berlin-sans text-[20px] font-normal decoration-solid mb-2 [text-decoration-skip-ink:none]">
                    <Link
                      className=" desktop:text-2xl mobile:text-lg short:text-lg tiny:text-[16px] underline"
                      href="/forgot-password"
                    >
                      Forgot Password?
                    </Link>
                  </p>
                )}
                {isChildLogin && isChildPasswordStep && (
                  <button
                    type="button"
                    className="self-start text-textGrey underline mb-2"
                    onClick={() => {
                      setChildPasswordType(null);
                      setPassword("");
                      setChildColorSequence([]);
                      setPasswordError("");
                      setGeneralError("");
                    }}
                  >
                    Change email
                  </button>
                )}
                <button
                  className="w-full bg-loginGreen text-black desktop:h-12 mobile:h-8 short:h-8 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] text-center mb-4"
                  type="submit"
                >
                  {isChildLogin && !isChildPasswordStep ? "Continue" : "Login"}
                </button>

                <div className="flex justify-start flex-row">
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
              </form>
              {!isChildLogin && (
                <div className="flex flex-col mobile:gap-y-1 short:gap-y-1 desktop:gap-y-6 w-[80%]">
                  <div className="flex items-center justify-center w-full">
                    <div className="border border-textGrey w-full" />
                    <div className="text-textGrey px-4">or</div>
                    <div className="border border-textGrey w-full" />
                  </div>
                  <GoogleLoginButton setError={setGeneralError} />
                </div>
              )}
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

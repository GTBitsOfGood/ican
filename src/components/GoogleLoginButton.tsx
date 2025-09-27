import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import Image from "next/image";
import AuthHTTPClient from "@/http/authHTTPClient";

interface GoogleLoginButtonProps {
  forgotPassword?: boolean;
  setError?: (error: string) => void;
}

const GoogleLoginButton = ({
  forgotPassword = false,
  setError,
}: GoogleLoginButtonProps) => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await AuthHTTPClient.getGoogleUserInfo(
          tokenResponse.access_token,
        );

        const response = await AuthHTTPClient.loginWithGoogle(userInfo);

        // If this is a new user, redirect to pet selection
        // If existing user, redirect to home
        if (response.isNewUser) {
          router.push("/first-pet");
        } else {
          router.push("/");
        }
      } catch (error) {
        if (setError) {
          setError((error as Error).message);
        } else {
          console.error("Login failed:", error);
        }
      }
    },

    onError: () => {
      throw new Error("Google login failed.");
    },
  });

  return (
    <>
      {forgotPassword ? (
        <button
          className="w-full mobile:gap-y-1 short:gap-y-1 desktop:gap-y-2.5 border-2 flex py-3 justify-center items-center border-solid border-[#000] bg-white text-black mobile:h-8 desktop:h-12 short:h-8 tall:h-12 desktop:text-[24px]/[32px] short:text-[16px] mobile:text-[16px] text-center"
          type="submit"
          onClick={() => login()}
        >
          <Image
            src="/assets/GoogleSocialIcon.svg"
            alt="Google Logo"
            className="mobile:w-[25px] mobile:h-[25px] desktop:w-[40px] desktop:h-[40px] tiny:w-[25px] tiny:h-[25px] short:w-[25px] short:h-[25px] tall:w-[40px] tall:h-[40px]"
            width={40}
            height={40}
          />
          <div className="flex justify-center items-center desktop:h-12 mobile:h-8 tiny:h-8 short:h-8 tall:h-8 pl-2 mobile:text-[16px] desktop:text-[24px]/[32px] tiny:text-lg short:text-lg tall:text-2xl text-[#000]">
            Login with Google
          </div>
        </button>
      ) : (
        <button
          className="w-full gap-y-2.5 border-2 flex py-3 justify-center items-center border-solid border-[#000] bg-white text-black mobile:h-8 desktop:h-12 short:h-8 desktop:text-[24px]/[32px] short:text-[16px] mobile:text-[16px] text-center desktop:mb-3 mobile:mb-1 short:mb-1"
          type="button"
          onClick={() => login()}
        >
          <Image
            src="/GoogleSocialIcon.svg"
            alt="Google Logo"
            width={30}
            height={30}
          />
          <div className="px-3 desktop:text-[24px]/[32px] short:text-lg tiny:text-[16px] mobile:text-[16px] text-[24px]/[32px] text-[#000]">
            Login with Google
          </div>
        </button>
      )}
    </>
  );
};

export default GoogleLoginButton;

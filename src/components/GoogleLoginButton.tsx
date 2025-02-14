import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import Image from "next/image";
import { authService } from "@/http/authService";

interface GoogleLoginButtonProps {
  forgotPassword?: boolean;
}

const GoogleLoginButton = ({
  forgotPassword = false,
}: GoogleLoginButtonProps) => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const userInfo = await authService.getGoogleUserInfo(
          tokenResponse.access_token,
        );

        const response = await authService.loginWithGoogle(userInfo);
        localStorage.setItem("token", response.token);
        router.push("/");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
    onError: () => {
      console.error("Login failed");
    },
  });

  return (
    <>
      {forgotPassword ? (
        <button
          className="w-full py-3 flex justify-center items-center text-[32px] bg-white gap-y-2.5 border-2 border-solid border-[#000]"
          type="submit"
          onClick={() => login()}
        >
          <Image
            src="/assets/GoogleSocialIcon.svg"
            alt="Google Logo"
            width={40}
            height={40}
          />
          <div className="text-[32px] text-[#000]">Login with Google</div>
        </button>
      ) : (
        <button
          className="w-full gap-y-2.5 border-2 flex py-3 justify-center items-center border-solid border-[#000] bg-white text-black h-12 text-[24px]/[32px] text-center mb-4"
          type="button"
          onClick={() => login()}
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
      )}
    </>
  );
};

export default GoogleLoginButton;

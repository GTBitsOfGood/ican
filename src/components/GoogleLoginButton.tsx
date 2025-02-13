import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/router";
import { authService } from "@/http/authService";

const GoogleLoginButton = () => {
  const router = useRouter();

  const handleLoginSuccess = async (credentialResponse: CredentialResponse) => {
    const { credential } = credentialResponse;
    console.log("credential: ", credential);
    try {
      const response = await authService.loginWithGoogle(credential as string);
      localStorage.setItem("token", response.token);
      router.push("/");
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  const handleLoginFailure = () => {
    console.error("Login failed");
  };

  return (
    <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} />
  );
};

export default GoogleLoginButton;

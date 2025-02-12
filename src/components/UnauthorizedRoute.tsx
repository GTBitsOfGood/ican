import { useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "@/http/authService";
import { useUser } from "./UserContext";

export default function UnauthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUserId } = useUser();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        const response = await authService.validateToken();
        setUserId(response.decodedToken?.userId);
        router.push("/");
      } catch (error) {
        setUserId(null);
        console.log("error with validation: ", error);
      }
    };

    validateToken();
  }, [router]);

  return <>{children}</>;
}

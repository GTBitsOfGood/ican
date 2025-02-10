import { useEffect } from "react";
import { useRouter } from "next/router";
import { authService } from "@/http/authService";

export default function UnauthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        return;
      }

      try {
        await authService.validateToken();
        router.push("/");
      } catch (error) {
        console.log("error with validation: ", error);
      }
    };

    validateToken();
  }, [router]);

  return <>{children}</>;
}

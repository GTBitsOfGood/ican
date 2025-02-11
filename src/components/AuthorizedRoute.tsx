import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import { authService } from "@/http/authService";
import { useUser } from "./UserContext";

export default function AuthorizedRoute({
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
        router.push("/login");
        return;
      }

      try {
        const response = await authService.validateToken();
        setUserId(response.decodedToken?.userId);
      } catch (error) {
        console.log("error with validation: ", error);
        setUserId(null);
        router.push("/login");
      }
    };

    validateToken();
  }, [router]);

  return <>{children}</>;
}

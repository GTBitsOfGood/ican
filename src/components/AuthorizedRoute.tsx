import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import { authService } from "@/http/authService";

export default function AuthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const decodedToken = await authService.validateToken();
        console.log(decodedToken);
      } catch (error) {
        console.log("error with validation: ", error);
        router.push("/login");
      }
    };

    validateToken();
  }, [router]);

  return <>{children}</>;
}

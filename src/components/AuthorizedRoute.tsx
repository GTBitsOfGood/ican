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
        await authService.validateToken();
      } catch {
        router.push("/login");
      }
    };

    validateToken();
  }, [router]);

  return <>{children}</>;
}

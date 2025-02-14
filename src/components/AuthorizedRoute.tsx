import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import { authService } from "@/http/authService";
import { useUser } from "./UserContext";
import Image from "next/image";

export default function AuthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUserId } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("token");
      setLoading(true);

      if (!token) {
        setLoading(false);
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
      } finally {
        setLoading(false);
      }
    };

    validateToken();
  }, [router]);

  return (
    <>
      {loading ? (
        <div className="flex justify-between space-between items-center text-white text-[48px] font-bold text-shadow-default text-stroke-2 text-stroke-default mt-6 mb-4">
          <Image
            className="ml-3 spin"
            src="/loading.svg"
            alt="loading"
            width={60}
            height={60}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}

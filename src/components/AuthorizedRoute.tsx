import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import React from "react";
import AuthHTTPClient from "@/http/authHTTPClient";
import { useUser } from "./UserContext";
import Image from "next/image";
import { getAuthCookie } from "@/utils/cookie";

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
      const token = await getAuthCookie();
      setLoading(true);

      if (!token) {
        setLoading(false);
        router.push("/login");
        return;
      }

      try {
        const response = await AuthHTTPClient.validateToken();
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
  }, [router, setUserId]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Image
            className="spin"
            src="/loading.svg"
            alt="loading"
            width={100}
            height={100}
            style={{ filter: "brightness(0) invert(1)" }}
          />
        </div>
      ) : (
        children
      )}
    </>
  );
}

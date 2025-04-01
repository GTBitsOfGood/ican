import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import AuthHTTPClient from "@/http/authHTTPClient";
import { useUser } from "./UserContext";
import Image from "next/image";

export default function UnauthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUserId } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const validateToken = async () => {
      try {
        const token = await AuthHTTPClient.validateToken();

        if (!token.isValid) {
          setLoading(false);
          return;
        }
        setUserId(token.decodedToken?.userId);
        router.push("/");
      } catch (error) {
        setUserId(null);
        console.log("error with validation: ", error);
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

import { useEffect } from "react";
import { useRouter } from "next/router";
import { useUser } from "./UserContext";
import Image from "next/image";
import { useValidateToken } from "./hooks/useAuth";

export default function UnauthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { setUserId } = useUser();
  const { data: token, isLoading, isError } = useValidateToken();

  useEffect(() => {
    if (!isLoading) {
      if (!isError && token?.isValid && token?.decodedToken?.userId) {
        setUserId(token.decodedToken.userId);
        router.push("/");
      } else {
        setUserId(null);
      }
    }
  }, [isLoading, isError, token, router, setUserId]);

  if (isLoading) {
    return (
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
    );
  }

  if (!isError && token?.isValid) {
    return null;
  }

  return <>{children}</>;
}

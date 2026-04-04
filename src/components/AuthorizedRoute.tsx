import { useEffect } from "react";
import { useRouter } from "next/router";
import React from "react";
import { useUser } from "./UserContext";
import Image from "next/image";
import { useValidateToken, useOnboardingStatus } from "./hooks/useAuth";

const ONBOARDING_ROUTES = ["/onboarding", "/first-pet", "/medications"];

export default function AuthorizedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userId, setUserId } = useUser();
  const { data: token, isLoading, isError } = useValidateToken();
  const isOnboardingRoute = ONBOARDING_ROUTES.some((route) =>
    router.pathname.startsWith(route),
  );
  const { data: isOnboarded, isLoading: onboardingLoading } =
    useOnboardingStatus(userId);

  useEffect(() => {
    if (!isLoading) {
      if (isError || !token?.isValid) {
        setUserId(null);
        router.push("/login");
      } else if (token?.decodedToken?.origin === "forgot-password") {
        setUserId(null);
        router.push("/forgot-password");
      } else if (token?.decodedToken?.userId) {
        setUserId(token.decodedToken.userId);
      }
    }
  }, [isLoading, isError, token, router, setUserId]);

  useEffect(() => {
    if (!onboardingLoading && isOnboarded === false && !isOnboardingRoute) {
      router.replace("/onboarding");
    }
  }, [onboardingLoading, isOnboarded, isOnboardingRoute, router]);

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

  if (
    isError ||
    !token?.isValid ||
    token?.decodedToken?.origin === "forgot-password"
  ) {
    return null;
  }

  if (!onboardingLoading && isOnboarded === false && !isOnboardingRoute) {
    return null;
  }

  return <>{children}</>;
}

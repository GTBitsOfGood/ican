import { useEffect, ReactNode } from "react";
import { useRouter } from "next/router";
import { useUser } from "@/components/UserContext";
import { usePet } from "@/components/hooks/usePet";
import { useValidateToken } from "@/components/hooks/useAuth";
import LoadingScreen from "@/components/loadingScreen";

interface PetSelectionRouteProps {
  children: ReactNode;
}

export default function PetSelectionRoute({
  children,
}: PetSelectionRouteProps) {
  const { userId, setUserId } = useUser();
  const {
    data: token,
    isLoading: tokenLoading,
    isError: tokenError,
  } = useValidateToken();
  const { data: pet, isLoading: petLoading } = usePet();
  const router = useRouter();

  // Handle authentication first
  useEffect(() => {
    if (!tokenLoading) {
      if (tokenError || !token?.isValid) {
        setUserId(null);
        router.push("/login");
        return;
      } else if (token?.decodedToken?.userId) {
        setUserId(token.decodedToken.userId);
      }
    }
  }, [tokenLoading, tokenError, token, router, setUserId]);

  // Handle pet-based routing
  useEffect(() => {
    // Only check pet status if user is authenticated
    if (userId && pet && !petLoading) {
      router.push("/");
      return;
    }
  }, [userId, pet, petLoading, router]);

  // Show loading while checking authentication
  if (tokenLoading) {
    return <LoadingScreen />;
  }

  // If token is invalid, don't render anything (will redirect to login)
  if (tokenError || !token?.isValid) {
    return <LoadingScreen />;
  }

  // Show loading while checking pet status
  if (!userId || petLoading) {
    return <LoadingScreen />;
  }

  // If user has a pet, don't render children (will redirect)
  if (pet) {
    return <LoadingScreen />;
  }

  // User is authenticated but doesn't have a pet - show pet selection
  return <>{children}</>;
}

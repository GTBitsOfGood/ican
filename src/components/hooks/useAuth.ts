import AuthHTTPClient from "@/http/authHTTPClient";
import UserHTTPClient from "@/http/userHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const AUTH_QUERY_KEYS = {
  validateToken: ["validateToken"] as const,
} as const;

export const useValidateToken = () => {
  return useQuery({
    queryKey: AUTH_QUERY_KEYS.validateToken,
    queryFn: () => AuthHTTPClient.validateToken(),
    staleTime: 10 * 60 * 1000,
    // turn off retrying here because an error === we're not logged in
    retry: false,
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => AuthHTTPClient.logout(),
    onSuccess: () => {
      // Clear ALL cached data, since they are not needed anymore, and is cleaner
      queryClient.clear();

      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Logout failed:", error);
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => UserHTTPClient.deleteAccount(userId),
    onSuccess: () => {
      queryClient.clear();

      window.location.href = "/login";
    },
  });
};

export const USER_QUERY_KEYS = {
  onboardingStatus: (userId: string) =>
    ["user", "onboarding-status", userId] as const,
} as const;

export const useOnboardingStatus = (userId: string | null) => {
  return useQuery<boolean>({
    queryKey: USER_QUERY_KEYS.onboardingStatus(userId || ""),
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      const response = await UserHTTPClient.getOnboardingStatus(userId);
      return response.isOnboarded;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateOnboardingStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      isOnboarded,
    }: {
      userId: string;
      isOnboarded: boolean;
    }) => {
      return UserHTTPClient.updateOnboardingStatus(userId, isOnboarded);
    },

    onMutate: async ({ userId, isOnboarded }) => {
      await queryClient.cancelQueries({
        queryKey: USER_QUERY_KEYS.onboardingStatus(userId),
      });

      const previousStatus = queryClient.getQueryData<boolean>(
        USER_QUERY_KEYS.onboardingStatus(userId),
      );

      // Optimistic update
      queryClient.setQueryData<boolean>(
        USER_QUERY_KEYS.onboardingStatus(userId),
        isOnboarded,
      );

      return { previousStatus, userId };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousStatus !== undefined && context?.userId) {
        queryClient.setQueryData(
          USER_QUERY_KEYS.onboardingStatus(context.userId),
          context.previousStatus,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.onboardingStatus(variables.userId),
      });
    },
  });
};

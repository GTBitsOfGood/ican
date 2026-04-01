import AuthHTTPClient from "@/http/authHTTPClient";
import UserHTTPClient, {
  UpdateTutorialStatusBody,
} from "@/http/userHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { TutorialStatus } from "@/types/user";

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
  tutorialStatus: (userId: string) =>
    ["user", "tutorial-status", userId] as const,
  profile: (userId: string) => ["user", "profile", userId] as const,
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

export const useTutorialStatus = (userId: string | null) => {
  return useQuery<TutorialStatus>({
    queryKey: USER_QUERY_KEYS.tutorialStatus(userId || ""),
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      return await UserHTTPClient.getTutorialStatus(userId);
    },
    enabled: !!userId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useUserProfile = (userId: string | null) => {
  return useQuery<{ name: string; email: string }>({
    queryKey: USER_QUERY_KEYS.profile(userId || ""),
    queryFn: async () => {
      if (!userId) throw new Error("User ID required");

      return await UserHTTPClient.getProfile(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateTutorialStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      ...status
    }: {
      userId: string;
    } & UpdateTutorialStatusBody) => {
      return UserHTTPClient.updateTutorialStatus(userId, status);
    },

    onMutate: async ({ userId, ...status }) => {
      await queryClient.cancelQueries({
        queryKey: USER_QUERY_KEYS.tutorialStatus(userId),
      });

      const previousStatus = queryClient.getQueryData<TutorialStatus>(
        USER_QUERY_KEYS.tutorialStatus(userId),
      );

      if (previousStatus) {
        queryClient.setQueryData<TutorialStatus>(
          USER_QUERY_KEYS.tutorialStatus(userId),
          {
            tutorialCompleted:
              status.tutorialCompleted ?? previousStatus.tutorialCompleted,
            tutorialState: status.tutorialState,
            tutorialMode: status.tutorialMode,
            tutorialStep: status.tutorialStep ?? previousStatus.tutorialStep,
            tutorialMedicationType:
              status.tutorialMedicationType !== undefined
                ? status.tutorialMedicationType
                : previousStatus.tutorialMedicationType,
            tutorialShouldShowMedicationDrag:
              status.tutorialShouldShowMedicationDrag ??
              previousStatus.tutorialShouldShowMedicationDrag,
          },
        );
      }

      return { previousStatus, userId };
    },

    onError: (_error, _variables, context) => {
      if (context?.previousStatus && context.userId) {
        queryClient.setQueryData<TutorialStatus>(
          USER_QUERY_KEYS.tutorialStatus(context.userId),
          context.previousStatus,
        );
      }
    },

    onSettled: (_data, _error, variables) => {
      queryClient.invalidateQueries({
        queryKey: USER_QUERY_KEYS.tutorialStatus(variables.userId),
      });
    },
  });
};

import SettingsHTTPClient from "@/http/settingsHTTPClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { WithId } from "@/types/models";
import { Settings } from "@/db/models/settings";

export const SETTINGS_QUERY_KEYS = {
  settings: (userId: string) => ["settings", userId] as const,
} as const;

type SettingQueryData = WithId<Settings> | null;

export const useSettings = () => {
  const { userId } = useUser();

  return useQuery<SettingQueryData>({
    queryKey: SETTINGS_QUERY_KEYS.settings(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID required");

      return SettingsHTTPClient.getSettings(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useUpdateSettings = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      parentalControl,
      notifications,
      helpfulTips,
      largeFontSize,
    }: {
      parentalControl?: boolean;
      notifications?: boolean;
      helpfulTips?: boolean;
      largeFontSize?: boolean;
    }) => {
      if (!userId) throw new Error("User ID required");

      return SettingsHTTPClient.updateSettings(
        userId,
        parentalControl,
        notifications,
        helpfulTips,
        largeFontSize,
      );
    },

    // Optimistic
    onMutate: async ({
      parentalControl,
      notifications,
      helpfulTips,
      largeFontSize,
    }) => {
      if (!userId) return;

      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.settings(userId),
      });

      const previousSettings = queryClient.getQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
      );

      // Optimistic
      queryClient.setQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
        (old) =>
          old
            ? {
                ...old,
                ...(parentalControl !== undefined && { parentalControl }),
                ...(notifications !== undefined && { notifications }),
                ...(helpfulTips !== undefined && { helpfulTips }),
                ...(largeFontSize !== undefined && { largeFontSize }),
              }
            : old,
      );

      return { previousSettings };
    },

    onError: (err, newSettings, context) => {
      if (context?.previousSettings && userId) {
        queryClient.setQueryData(
          SETTINGS_QUERY_KEYS.settings(userId),
          context.previousSettings,
        );
      }
    },

    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: SETTINGS_QUERY_KEYS.settings(userId),
        });
      }
    },
  });
};

export const useUpdatePin = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (pin: string) => {
      if (!userId) throw new Error("User ID required");
      return SettingsHTTPClient.updatePin(userId, pin);
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: SETTINGS_QUERY_KEYS.settings(userId),
        });
      }
    },
  });
};

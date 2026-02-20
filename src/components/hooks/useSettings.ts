import SettingsHTTPClient from "@/http/settingsHTTPClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { WithId } from "@/types/models";
import { Settings } from "@/db/models/settings";
import { ChildPasswordType } from "@/types/user";

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
      notifications,
      helpfulTips,
      largeFontSize,
    }: {
      notifications?: boolean;
      helpfulTips?: boolean;
      largeFontSize?: boolean;
    }) => {
      if (!userId) throw new Error("User ID required");

      return SettingsHTTPClient.updateSettings(
        userId,
        notifications,
        helpfulTips,
        largeFontSize,
      );
    },

    onMutate: async ({ notifications, helpfulTips, largeFontSize }) => {
      if (!userId) return;

      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.settings(userId),
      });

      const previousSettings = queryClient.getQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
      );

      queryClient.setQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
        (old) =>
          old
            ? {
                ...old,
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
    mutationFn: (pin: string | null) => {
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

export const useUpdateChildLogin = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      childPassword,
      childPasswordType,
    }: {
      childPassword: string;
      childPasswordType: ChildPasswordType;
    }) => {
      if (!userId) throw new Error("User ID required");
      return SettingsHTTPClient.updateChildLogin(
        userId,
        childPassword,
        childPasswordType,
      );
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

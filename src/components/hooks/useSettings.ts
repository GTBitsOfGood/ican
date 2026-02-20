import SettingsHTTPClient from "@/http/settingsHTTPClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { WithId } from "@/types/models";
import { Settings } from "@/db/models/settings";
import { UpdateSettingsRequestBody } from "@/types/settings";

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
    mutationFn: (body: UpdateSettingsRequestBody) => {
      if (!userId) throw new Error("User ID required");
      return SettingsHTTPClient.updateSettings(userId, body);
    },

    onMutate: async (body) => {
      if (!userId) return;

      await queryClient.cancelQueries({
        queryKey: SETTINGS_QUERY_KEYS.settings(userId),
      });

      const previousSettings = queryClient.getQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
      );

      queryClient.setQueryData<SettingQueryData>(
        SETTINGS_QUERY_KEYS.settings(userId),
        (old) => {
          if (!old) return old;
          const updated = { ...old };
          if (body.notifications !== undefined)
            updated.notifications = body.notifications;
          if (body.helpfulTips !== undefined)
            updated.helpfulTips = body.helpfulTips;
          if (body.largeFontSize !== undefined)
            updated.largeFontSize = body.largeFontSize;
          if (body.notificationPreferences) {
            updated.notificationPreferences = {
              ...updated.notificationPreferences,
              ...body.notificationPreferences,
            };
          }
          return updated;
        },
      );

      return { previousSettings };
    },

    onError: (_err, _body, context) => {
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

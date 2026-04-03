import TutorialHTTPClient, {
  ResetTutorialBody,
  TutorialMedicationSetup,
  TutorialProgress,
} from "@/http/tutorialHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { PET_QUERY_KEYS } from "./usePet";
import { MEDICATION_QUERY_KEYS } from "./useMedication";
import { USER_QUERY_KEYS } from "./useAuth";

export const TUTORIAL_QUERY_KEYS = {
  progress: () => ["tutorialProgress"] as const,
} as const;

export const useTutorialProgress = (isTutorial: boolean = true) => {
  const { userId } = useUser();

  return useQuery<TutorialProgress>({
    queryKey: TUTORIAL_QUERY_KEYS.progress(),
    queryFn: TutorialHTTPClient.getTutorialProgress,
    staleTime: 30 * 1000,
    enabled: !!userId && isTutorial,
  });
};

export const useSetupTutorialMedication = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TutorialHTTPClient.setupTutorialMedication,
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allSchedules(userId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: TUTORIAL_QUERY_KEYS.progress(),
      });
    },
  });
};

export type { TutorialMedicationSetup };

export const useEnsureStarterKit = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: TutorialHTTPClient.ensureStarterKit,
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.pet(userId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: TUTORIAL_QUERY_KEYS.progress(),
      });
    },
  });
};

export const useResetTutorial = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body?: ResetTutorialBody) =>
      TutorialHTTPClient.resetTutorial(body),
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allSchedules(userId),
        });
        queryClient.invalidateQueries({
          queryKey: PET_QUERY_KEYS.pet(userId),
        });
        queryClient.invalidateQueries({
          queryKey: USER_QUERY_KEYS.tutorialStatus(userId),
        });
      }
      queryClient.invalidateQueries({
        queryKey: TUTORIAL_QUERY_KEYS.progress(),
      });
    },
  });
};

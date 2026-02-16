import TutorialHTTPClient, {
  TutorialProgress,
} from "@/http/tutorialHTTPClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { PET_QUERY_KEYS } from "./usePet";
import { MEDICATION_QUERY_KEYS } from "./useMedication";

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

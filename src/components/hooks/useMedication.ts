import MedicationHTTPClient from "@/http/medicationHTTPClient";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useUser } from "@/components/UserContext";
import { MedicationInfo } from "@/types/medication";
import { PET_QUERY_KEYS } from "./usePet";
import { TUTORIAL_QUERY_KEYS } from "./useTutorial";

export const MEDICATION_QUERY_KEYS = {
  allMedications: (userId: string) => ["medications", userId] as const,
  medication: (medicationId: string) => ["medication", medicationId] as const,
  allSchedules: (userId: string) => ["medicationSchedule", userId] as const,
  schedule: (userId: string, date: string) =>
    ["medicationSchedule", userId, date] as const,
} as const;

export const useUserMedications = () => {
  const { userId } = useUser();

  return useQuery({
    queryKey: MEDICATION_QUERY_KEYS.allMedications(userId || ""),
    queryFn: () => {
      if (!userId) throw new Error("User ID required to fetch medications");

      return MedicationHTTPClient.getAllUserMedications(userId);
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedication = (medicationId: string | undefined) => {
  return useQuery({
    queryKey: MEDICATION_QUERY_KEYS.medication(medicationId || ""),
    queryFn: () => {
      if (!medicationId) throw new Error("Medication ID required");

      return MedicationHTTPClient.getMedication(medicationId);
    },
    enabled: !!medicationId,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMedicationSchedule = (date: string, localTime: string) => {
  const { userId } = useUser();

  return useQuery({
    queryKey: MEDICATION_QUERY_KEYS.schedule(userId || "", date),
    queryFn: () => {
      if (!userId) throw new Error("User ID required");

      return MedicationHTTPClient.getMedicationSchedule(
        userId,
        date,
        localTime,
      );
    },
    enabled: !!userId && !!date,
    staleTime: 60 * 1000,
  });
};

export const useCreateMedication = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationInfo: MedicationInfo) => {
      if (!userId) throw new Error("User ID required");

      return MedicationHTTPClient.createMedication(userId, medicationInfo);
    },
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });
      }
    },
  });
};

export const useUpdateMedication = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MedicationHTTPClient.updateMedication,
    onSettled: (_, __, variables) => {
      queryClient.invalidateQueries({
        queryKey: MEDICATION_QUERY_KEYS.medication(variables.medicationId),
      });
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });
      }
    },
  });
};

export const useDeleteMedication = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationId: string) => {
      return MedicationHTTPClient.deleteMedication(medicationId);
    },
    onSettled: (_, __, medicationId) => {
      queryClient.removeQueries({
        queryKey: MEDICATION_QUERY_KEYS.medication(medicationId),
      });
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });
      }
    },
  });
};

export const useMedicationCheckIn = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MedicationHTTPClient.medicationCheckIn,
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allSchedules(userId),
        });
      }
    },
  });
};

export const useMedicationLog = () => {
  const { userId } = useUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: MedicationHTTPClient.medicationLog,
    onSettled: () => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allSchedules(userId),
        });
        queryClient.invalidateQueries({
          queryKey: MEDICATION_QUERY_KEYS.allMedications(userId),
        });

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

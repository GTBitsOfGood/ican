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

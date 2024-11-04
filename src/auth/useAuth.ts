import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService, { AuthenticationError } from "./authService";

export const AUTH_QUERY_KEY = ["auth"];

export default function useAuth() {
  const queryClient = useQueryClient();

  const { data: accessToken } = useQuery<string>({
    queryKey: AUTH_QUERY_KEY,
    staleTime: Infinity,
    gcTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (data) => {
      queryClient.setQueryData(AUTH_QUERY_KEY, data.access_token);
    },
    retry: (attempts, error) => {
      if (error instanceof AuthenticationError) return false;
      return attempts < 2;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(accessToken),
    onMutate: () => {
      queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  return {
    accessToken: accessToken ?? null,
    isAuthenticated: accessToken !== undefined,
    loginMutation,
    logoutMutation,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService from "./authService";

export const AUTH_QUERY_KEY = ["auth"];

export type UseAuthOptions = {
  onLoginError?: (message: string) => void;
};

export default function useAuth(options: UseAuthOptions = {}) {
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
      if ("error" in data) {
        if (options.onLoginError) options.onLoginError(data.error);
        return;
      }
      queryClient.setQueryData(AUTH_QUERY_KEY, data.access_token);
    },
    retry: 3,
  });

  const logoutMutation = useMutation({
    mutationFn: authService.logout,
    onSettled: () => {
      queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY });
    },
  });

  return {
    accessToken: accessToken ?? null,
    isAuthenticated: accessToken !== undefined,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import authService, { AuthenticationError } from "./authService";

export const AUTH_QUERY_KEY = ["auth"];

export type UseAuthOptions = {
  onLoginError?: (message: string) => void;
  onLoginSuccess?: (accessToken: string) => void;
  onLogout?: () => void;
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
      if (options.onLoginSuccess) options.onLoginSuccess(data.access_token);
    },
    retry: (attempts, error) => {
      if (error instanceof AuthenticationError) return false;
      return attempts < 3;
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(accessToken),
    onMutate: () => {
      queryClient.resetQueries({ queryKey: AUTH_QUERY_KEY });
      if (options.onLogout) options.onLogout();
    },
  });

  return {
    accessToken: accessToken ?? null,
    isAuthenticated: accessToken !== undefined,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}

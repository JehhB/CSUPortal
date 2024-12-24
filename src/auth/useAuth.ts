import { useMutation } from "@tanstack/react-query";
import authService, { AuthenticationError } from "./authService";
import { useContext } from "react";
import { AuthContext } from "./AuthProvider";

export const LOGIN_MUTATION_KEY = "login";
export const LOGOUT_MUTATION_KEY = "logout";
export const CHANGE_PASSWORD_MUTATION_KEY = "changePassword";

export default function useAuth() {
  const { accessToken, setAccessToken } = useContext(AuthContext);

  const loginMutation = useMutation({
    mutationKey: [LOGIN_MUTATION_KEY],
    mutationFn: authService.login,
    onSuccess: (data) => {
      setAccessToken(data.access_token);
    },
    retry: (attempts, error) => {
      if (error instanceof AuthenticationError) return false;
      return attempts < 2;
    },
  });

  const logoutMutation = useMutation({
    mutationKey: [LOGOUT_MUTATION_KEY, accessToken],
    mutationFn: async () => {
      await authService.logout(accessToken);
    },
    onMutate: () => {
      setAccessToken(null);
    },
  });

  const changePasswordMutation = useMutation({
    mutationKey: [CHANGE_PASSWORD_MUTATION_KEY, accessToken],
    mutationFn: (options: { oldPassword: string; newPassword: string }) =>
      authService.changePassword(
        accessToken,
        options.oldPassword,
        options.newPassword,
      ),
  });

  return {
    accessToken: accessToken,
    isAuthenticated: accessToken !== null,
    loginMutation,
    logoutMutation,
    changePasswordMutation,
    login: loginMutation.mutate,
    logout: logoutMutation.mutate,
  };
}

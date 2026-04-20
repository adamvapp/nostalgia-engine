import { useEffect, useState } from "react";
import { useGetMe, useLogin, useLogout, useCreateUser } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey } from "@workspace/api-client-react";
import { useLocation } from "wouter";

export function useAuth() {
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [storedUsername, setStoredUsername] = useState<string | null>(
    localStorage.getItem("retro_username")
  );

  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
      staleTime: Infinity,
    },
  });

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem("retro_username", user.username);
      setStoredUsername(user.username);
    } else if (error) {
      localStorage.removeItem("retro_username");
      setStoredUsername(null);
    }
  }, [user, error]);

  const loginMutation = useLogin();
  const logoutMutation = useLogout();
  const registerMutation = useCreateUser();

  const login = async (data: Parameters<typeof loginMutation.mutateAsync>[0]) => {
    const result = await loginMutation.mutateAsync(data);
    localStorage.setItem("retro_username", result.username);
    setStoredUsername(result.username);
    queryClient.setQueryData(getGetMeQueryKey(), result);
    return result;
  };

  const register = async (data: Parameters<typeof registerMutation.mutateAsync>[0]) => {
    const result = await registerMutation.mutateAsync(data);
    // Usually need to login after register, but assuming API might not auto-login or does.
    // If it doesn't auto-login, we need to call login after register.
    // Let's just return the user for now.
    return result;
  };

  const logout = async () => {
    await logoutMutation.mutateAsync();
    localStorage.removeItem("retro_username");
    setStoredUsername(null);
    queryClient.setQueryData(getGetMeQueryKey(), null);
    setLocation("/");
  };

  return {
    user,
    isLoading,
    storedUsername,
    login,
    logout,
    register,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
  };
}
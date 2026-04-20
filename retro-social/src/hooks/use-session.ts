import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
// 1. Remove the @workspace/api-client-react import and replace with:
export const useSession = () => {
  return {
    user: { 
      username: "retro_user", 
      displayName: "Retro Enthusiast",
      avatarUrl: "" 
    },
    isLoading: false,
    error: null
  };
};

export const useLogout = () => ({
  mutateAsync: async () => ({ success: true }),
  isPending: false
});

export function useSession() {
  const { data: user, isLoading, error } = useGetMe({
    query: {
      retry: false,
      staleTime: Infinity,
    },
  });

  const pingMutation = usePingUser();

  useEffect(() => {
    if (user?.username) {
      localStorage.setItem("retro_username", user.username);
    } else if (error) {
      localStorage.removeItem("retro_username");
    }
  }, [user, error]);

  // Ping every 30 seconds if logged in
  useEffect(() => {
    if (!user?.username) return;
    const username = user.username;

    const interval = setInterval(() => {
      pingMutation.mutate({ username });
    }, 30000);

    return () => clearInterval(interval);
  }, [user?.username]);

  return { user, isLoading, isAuthenticated: !!user?.username };
}

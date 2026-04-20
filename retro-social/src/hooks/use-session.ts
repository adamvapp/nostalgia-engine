// src/hooks/use-session.ts

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

// Ensure there is NO other 'export function useSession' 
// or 'export const useSession' below this line.

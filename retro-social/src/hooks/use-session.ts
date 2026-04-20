// src/hooks/use-session.ts

export const useSession = () => {
  return {
    user: { 
      username: "retro_user", 
      displayName: "Retro Enthusiast",
      avatarUrl: "https://api.dicebear.com/7.x/pixel-art/svg?seed=retro",
      profileColor: "#00ffff",
      bio: "Living in the circuit.",
      mood: "Vibing"
    },
    isLoading: false,
    error: null
  };
};

export const useLogout = () => ({
  mutateAsync: async () => ({ success: true }),
  isPending: false
});

// ADD THESE TO FIX THE CONSOLE ERROR:
export const useGetInbox = () => ({
  data: [
    { id: 1, from: "System", message: "Welcome to Social Circuit!", sentAt: new Date().toISOString() },
    { id: 2, from: "Tom", message: "Nice scrolling background!", sentAt: new Date().toISOString() }
  ],
  isLoading: false
});

export const useGetBuddyList = () => ({
  data: [
    { username: "Tom", displayName: "Tom", isOnline: true },
    { username: "Circuit_Ghost", displayName: "Ghost", isOnline: false }
  ],
  isLoading: false
});

export const getGetBuddyListQueryKey = (username: string) => ["buddies", username];

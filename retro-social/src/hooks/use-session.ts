import { useState, useEffect } from "react";

export const useSession = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if someone is logged in locally
    const savedUser = localStorage.getItem("retro_session_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  return { user, isLoading, error: null };
};

export const useLogout = () => ({
  mutateAsync: async () => {
    localStorage.removeItem("retro_session_user");
    window.location.href = "/login"; // Kick back to login
  },
  isPending: false
});

// Keep your UI stubs so the pages don't crash
export const useGetInbox = () => ({
  data: [{ unreadCount: 5, from: "System", message: "Welcome back!" }],
  isLoading: false
});

export const useGetBuddyList = () => ({
  data: [{ username: "Tom", displayName: "Tom", isOnline: true }],
  isLoading: false
});

export const getGetBuddyListQueryKey = (username: string) => ["buddies", username];

// This fixes the "Settings" page
export const useUpdateProfile = () => ({
  mutateAsync: async (data: any) => {
    const current = JSON.parse(localStorage.getItem("retro_session_user") || "{}");
    localStorage.setItem("retro_session_user", JSON.stringify({ ...current, ...data }));
  },
  isPending: false
});

// This fixes the "Buddies" page
export const useGetBuddies = () => ({
  data: [
    { id: 1, username: "Tom", status: "online", mood: "Classic" },
    { id: 2, username: "Circuit_Ghost", status: "offline", mood: "Ghosting" }
  ],
  isLoading: false
});

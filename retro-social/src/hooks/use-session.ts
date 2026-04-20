import { useState, useEffect } from "react";

export const useSession = () => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if a user is "logged in" in this browser
    const savedUser = localStorage.getItem("retro_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  return { user, isLoading, error: null };
};

export const useLogout = () => ({
  mutateAsync: async () => {
    localStorage.removeItem("retro_user");
    window.location.href = "/"; // Refresh to show the logged-out state
  },
  isPending: false
});

// Keep your other stubs below...
export const useGetInbox = () => ({
  data: [
    { unreadCount: 5, from: "System", message: "Welcome back!" }
  ],
  isLoading: false
});

export const useGetBuddyList = () => ({
  data: [
    { username: "Tom", displayName: "Tom", isOnline: true }
  ],
  isLoading: false
});

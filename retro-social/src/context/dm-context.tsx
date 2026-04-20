import { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface OpenChat {
  username: string;
  displayName: string;
  profileColor?: string | null;
}

interface DMContextValue {
  openChats: OpenChat[];
  openChat: (user: OpenChat) => void;
  closeChat: (username: string) => void;
}

const DMContext = createContext<DMContextValue>({
  openChats: [],
  openChat: () => {},
  closeChat: () => {},
});

export function DMProvider({ children }: { children: ReactNode }) {
  const [openChats, setOpenChats] = useState<OpenChat[]>([]);

  const openChat = useCallback((user: OpenChat) => {
    setOpenChats(prev => {
      if (prev.some(c => c.username === user.username)) {
        return prev;
      }
      return [...prev.slice(-2), user];
    });
  }, []);

  const closeChat = useCallback((username: string) => {
    setOpenChats(prev => prev.filter(c => c.username !== username));
  }, []);

  return (
    <DMContext.Provider value={{ openChats, openChat, closeChat }}>
      {children}
    </DMContext.Provider>
  );
}

export function useDM() {
  return useContext(DMContext);
}

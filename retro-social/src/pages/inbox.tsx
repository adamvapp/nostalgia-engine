import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import { useDM } from "@/context/dm-context";
import { formatDistanceToNow } from "date-fns";

// --- STUBS START ---
const useGetMe = () => ({ data: { username: "user", displayName: "User" }, isLoading: false });
const useMarkRead = () => ({ mutate: () => {} });

// We need this one specifically for line 15 to work
const useGetInbox = (username: string, options?: any) => ({
  data: [
    { 
      username: "Tom", 
      displayName: "Tom", 
      lastMessage: "Yo! Love the new look of the site.", 
      lastMessageAt: new Date().toISOString(),
      unreadCount: 2,
      isOnline: true,
      profileColor: "#00ffff"
    },
    { 
      username: "Circuit_Ghost", 
      displayName: "Ghost", 
      lastMessage: "BRB, getting a Surge soda.", 
      lastMessageAt: new Date(Date.now() - 3600000).toISOString(),
      unreadCount: 0,
      isOnline: false,
      profileColor: "#ff00ff"
    }
  ],
  isLoading: false 
});
// --- STUBS END ---

export default function Inbox() {
  const { user } = useSession();
  const { openChat } = useDM();

  const { data: conversations = [], isLoading } = useGetInbox(user?.username ?? "", {
    query: { enabled: !!user?.username, refetchInterval: 8000 }
  });

  if (isLoading) {
    return <div className="text-center text-primary mt-10 animate-pulse font-display text-2xl">LOADING IMs...</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto w-full"
    >
      <div className="retro-container bg-card p-4 border-2 border-primary shadow-[0_0_15px_var(--color-primary)]">
        <h1 className="text-3xl font-display text-primary mb-4 text-center border-b-2 border-primary pb-2 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
          Instant Messages
        </h1>

        {conversations.length === 0 ? (
          <div className="text-center text-muted-foreground font-mono py-12">
            <p className="text-xl mb-2">no IMs yet :-/</p>
            <p className="text-sm">go to a buddy's profile and hit "Send IM" to start chatting!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => {
              const accentColor = conv.profileColor ?? "#ff00ff";
              return (
                <div
                  key={conv.username}
                  onClick={() => openChat({ username: conv.username, displayName: conv.displayName, profileColor: conv.profileColor })}
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-primary/10 transition-colors border border-transparent hover:border-primary/30"
                  style={{ borderLeft: `3px solid ${accentColor}` }}
                >
                  <div className="relative shrink-0">
                    <Avatar className="w-12 h-12 border-2 rounded-none" style={{ borderColor: accentColor }}>
                      <AvatarImage src={conv.avatarUrl || undefined} />
                      <AvatarFallback className="rounded-none bg-muted text-muted-foreground font-display text-xl">
                        {conv.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${conv.isOnline ? "bg-green-500 shadow-[0_0_5px_#0f0]" : "bg-gray-500"}`} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-bold font-display" style={{ color: accentColor }}>
                        {conv.displayName}
                      </span>
                      <span className="text-xs text-muted-foreground font-mono shrink-0">
                        {formatDistanceToNow(new Date(conv.lastMessageAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground truncate font-mono mt-0.5">
                      {conv.lastMessage}
                    </div>
                  </div>

                  {conv.unreadCount > 0 && (
                    <div
                      style={{
                        background: "#ff0000",
                        color: "#fff",
                        fontFamily: "'VT323', monospace",
                        fontSize: "1rem",
                        borderRadius: 2,
                        padding: "0 8px",
                        lineHeight: 1.4,
                        shrink: 0,
                      }}
                      className="shrink-0"
                    >
                      {conv.unreadCount} new
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

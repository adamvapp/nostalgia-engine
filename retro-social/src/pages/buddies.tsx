import { useSession } from "@/hooks/use-session";
import { useGetBuddyList, useListUsers, useAddBuddy, useRemoveBuddy, getGetBuddyListQueryKey } from "@workspace/api-client-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useDM } from "@/context/dm-context";

export default function Buddies() {
  const { user } = useSession();
  const [filter, setFilter] = useState("");
  const [findFilter, setFindFilter] = useState("");
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { openChat } = useDM();

  const { data: buddies, isLoading } = useGetBuddyList(user?.username || "", {
    query: { enabled: !!user?.username, refetchInterval: 15000 }
  });

  const { data: allUsers } = useListUsers();

  const addBuddyMutation = useAddBuddy();
  const removeBuddyMutation = useRemoveBuddy();

  const buddyUsernames = new Set(buddies?.map(b => b.username) || []);

  const handleAddBuddy = async (buddyUsername: string) => {
    if (!user) return;
    try {
      await addBuddyMutation.mutateAsync({ username: user.username, data: { buddyUsername } });
      queryClient.invalidateQueries({ queryKey: getGetBuddyListQueryKey(user.username) });
      toast({ title: "Buddy Added!", description: `${buddyUsername} is now your buddy :-)` });
    } catch {
      toast({ title: "Error", description: "Failed to add buddy", variant: "destructive" });
    }
  };

  const handleRemoveBuddy = async (buddyUsername: string) => {
    if (!user) return;
    try {
      await removeBuddyMutation.mutateAsync({ username: user.username, buddyUsername });
      queryClient.invalidateQueries({ queryKey: getGetBuddyListQueryKey(user.username) });
      toast({ title: "Buddy Removed", description: `${buddyUsername} removed from your list` });
    } catch {
      toast({ title: "Error", description: "Failed to remove buddy", variant: "destructive" });
    }
  };

  const discoverUsers = allUsers?.filter(u =>
    u.username !== user?.username &&
    !buddyUsernames.has(u.username) &&
    (u.displayName.toLowerCase().includes(findFilter.toLowerCase()) ||
     u.username.toLowerCase().includes(findFilter.toLowerCase()))
  ) || [];

  if (isLoading) {
    return <div className="text-center text-primary mt-10 animate-pulse font-display text-2xl">LOADING BUDDIES...</div>;
  }

  const onlineBuddies = buddies?.filter(b => b.isOnline && b.displayName.toLowerCase().includes(filter.toLowerCase())) || [];
  const offlineBuddies = buddies?.filter(b => !b.isOnline && b.displayName.toLowerCase().includes(filter.toLowerCase())) || [];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="max-w-2xl mx-auto w-full flex flex-col gap-6"
    >
      {/* Buddy List */}
      <div className="retro-container bg-card p-4 border-2 border-primary shadow-[0_0_15px_var(--color-primary)]">
        <h1 className="text-3xl font-display text-primary mb-4 text-center border-b-2 border-primary pb-2 drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
          Buddy List
        </h1>

        <Input 
          placeholder="Filter buddies..." 
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="mb-4 bg-background border-primary text-foreground rounded-none font-mono text-sm"
        />

        <div className="space-y-6">
          {/* Online Buddies */}
          <div>
            <div className="font-bold text-secondary border-b border-secondary/50 mb-2 font-mono flex justify-between">
              <span>ONLINE</span>
              <span>({onlineBuddies.length})</span>
            </div>
            
            <div className="space-y-2">
              {onlineBuddies.length === 0 ? (
                <div className="text-muted-foreground text-sm italic font-mono pl-2">No buddies online</div>
              ) : (
                onlineBuddies.map(buddy => (
                  <div key={buddy.id} className="flex items-center gap-2 p-2 hover:bg-secondary/10 transition-colors group">
                    <Link href={`/profile/${buddy.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10 border rounded-none" style={{ borderColor: buddy.profileColor || 'var(--color-secondary)' }}>
                          <AvatarImage src={buddy.avatarUrl || undefined} />
                          <AvatarFallback className="rounded-none bg-muted text-muted-foreground font-display text-lg">
                            {buddy.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black shadow-[0_0_5px_#0f0]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-foreground group-hover:text-secondary truncate">{buddy.displayName}</div>
                        <div className="text-xs text-muted-foreground truncate italic">
                          {buddy.mood ? `is feeling: ${buddy.mood}` : ""}
                        </div>
                      </div>
                    </Link>
                    <button
                      onClick={() => openChat({ username: buddy.username, displayName: buddy.displayName, profileColor: buddy.profileColor })}
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: "0.85rem",
                        color: "#00ffff",
                        background: "transparent",
                        border: "1px solid #00ffff44",
                        padding: "2px 8px",
                        cursor: "pointer",
                        shrink: 0,
                      }}
                      className="shrink-0 hover:border-cyan-400 hover:bg-cyan-400/10 transition-colors"
                    >
                      IM
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBuddy(buddy.username)}
                      disabled={removeBuddyMutation.isPending}
                      className="shrink-0 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      [remove]
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Offline Buddies */}
          <div>
            <div className="font-bold text-muted-foreground border-b border-muted-foreground/50 mb-2 font-mono flex justify-between">
              <span>OFFLINE</span>
              <span>({offlineBuddies.length})</span>
            </div>
            
            <div className="space-y-2">
              {offlineBuddies.length === 0 && onlineBuddies.length === 0 ? (
                <div className="text-muted-foreground text-sm italic font-mono pl-2 text-center py-4">Your buddy list is empty. Find some friends below!</div>
              ) : offlineBuddies.length === 0 ? (
                <div className="text-muted-foreground text-sm italic font-mono pl-2">None</div>
              ) : (
                offlineBuddies.map(buddy => (
                  <div key={buddy.id} className="flex items-center gap-2 p-2 hover:bg-muted transition-colors opacity-75 hover:opacity-100 group">
                    <Link href={`/profile/${buddy.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="relative shrink-0">
                        <Avatar className="w-10 h-10 border rounded-none border-muted-foreground grayscale">
                          <AvatarImage src={buddy.avatarUrl || undefined} />
                          <AvatarFallback className="rounded-none bg-muted text-muted-foreground font-display text-lg">
                            {buddy.displayName.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-gray-500 rounded-full border border-black" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-muted-foreground group-hover:text-foreground truncate">{buddy.displayName}</div>
                        <div className="text-xs text-muted-foreground truncate italic">@{buddy.username}</div>
                      </div>
                    </Link>
                    <button
                      onClick={() => openChat({ username: buddy.username, displayName: buddy.displayName, profileColor: buddy.profileColor })}
                      style={{
                        fontFamily: "'VT323', monospace",
                        fontSize: "0.85rem",
                        color: "#888",
                        background: "transparent",
                        border: "1px solid #44444444",
                        padding: "2px 8px",
                        cursor: "pointer",
                      }}
                      className="shrink-0"
                    >
                      IM
                    </button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemoveBuddy(buddy.username)}
                      disabled={removeBuddyMutation.isPending}
                      className="shrink-0 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-none font-mono opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      [remove]
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Find Buddies */}
      <div className="retro-container bg-card p-4 border-2 border-secondary shadow-[0_0_15px_var(--color-secondary)]">
        <h2 className="text-2xl font-display text-secondary mb-4 text-center border-b-2 border-secondary pb-2 drop-shadow-[0_0_5px_rgba(0,255,255,0.5)]">
          Find Buddies
        </h2>

        <Input 
          placeholder="Search users by name or screen name..." 
          value={findFilter}
          onChange={(e) => setFindFilter(e.target.value)}
          className="mb-4 bg-background border-secondary text-foreground rounded-none font-mono text-sm"
        />

        <div className="space-y-2">
          {discoverUsers.length === 0 ? (
            <div className="text-muted-foreground text-sm italic font-mono text-center py-4">
              {findFilter ? "No users found matching that name" : "You've added everyone as a buddy! :-)"}
            </div>
          ) : (
            discoverUsers.map(u => (
              <div key={u.id} className="flex items-center gap-3 p-2 hover:bg-secondary/10 transition-colors group border border-transparent hover:border-secondary/30">
                <Link href={`/profile/${u.username}`} className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="relative shrink-0">
                    <Avatar className="w-10 h-10 border rounded-none" style={{ borderColor: u.profileColor || 'var(--color-secondary)' }}>
                      <AvatarImage src={u.avatarUrl || undefined} />
                      <AvatarFallback className="rounded-none bg-muted text-muted-foreground font-display text-lg">
                        {u.displayName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-black ${u.isOnline ? 'bg-green-500 shadow-[0_0_5px_#0f0]' : 'bg-gray-500'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-foreground group-hover:text-secondary truncate">{u.displayName}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      @{u.username} {u.isOnline ? <span className="text-green-400">• online</span> : ""}
                    </div>
                    {u.mood && (
                      <div className="text-xs text-muted-foreground italic truncate">is feeling: {u.mood}</div>
                    )}
                  </div>
                </Link>
                <Button
                  size="sm"
                  onClick={() => handleAddBuddy(u.username)}
                  disabled={addBuddyMutation.isPending}
                  className="shrink-0 rounded-none font-bold font-mono text-xs border border-secondary bg-transparent text-secondary hover:bg-secondary hover:text-black transition-colors"
                >
                  + ADD
                </Button>
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
}

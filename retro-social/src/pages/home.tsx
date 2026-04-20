import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";

// PASTE THIS INSTEAD:
const useGetMe = () => ({ data: { username: "user", displayName: "User", mood: "" }, isLoading: false });
const useGetShoutbox = () => ({ data: [], isLoading: false });
const usePostShout = () => ({ mutateAsync: async () => {}, isPending: false });
const useDeleteShout = () => ({ mutateAsync: async () => {}, isPending: false });
const useGetOnlineUsers = () => ({ data: [], isLoading: false });
const getGetShoutboxQueryKey = () => ["shoutbox"];
const useUpdateMood = () => ({ mutateAsync: async () => {}, isPending: false });
const getGetMeQueryKey = () => ["me"];

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

export default function Home() {
  const { data: user } = useGetMe({ query: { retry: false } });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: shoutboxMessages, isLoading: isLoadingShouts } = useGetShoutbox(
    { limit: 50 },
    {
      query: {
        refetchInterval: 15000,
        queryKey: getGetShoutboxQueryKey({ limit: 50 }),
      },
    }
  );

  const { data: onlineUsers, isLoading: isLoadingOnline } = useGetOnlineUsers({
    query: { refetchInterval: 15000 },
  });

  const postShoutMutation = usePostShout();
  const deleteShoutMutation = useDeleteShout();
  const updateMoodMutation = useUpdateMood();

  const [newMessage, setNewMessage] = useState("");
  const [newMood, setNewMood] = useState("");
  const [isEditingMood, setIsEditingMood] = useState(false);

  const shoutboxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shoutboxRef.current) {
      shoutboxRef.current.scrollTop = shoutboxRef.current.scrollHeight;
    }
  }, [shoutboxMessages]);

  const handlePostShout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;
    try {
      await postShoutMutation.mutateAsync({
        data: { username: user.username, message: newMessage },
      });
      setNewMessage("");
      queryClient.invalidateQueries({ queryKey: getGetShoutboxQueryKey({ limit: 50 }) });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to post message",
        variant: "destructive",
      });
    }
  };

  const handleDeleteShout = async (id: number) => {
    try {
      await deleteShoutMutation.mutateAsync({ id });
      queryClient.invalidateQueries({ queryKey: getGetShoutboxQueryKey({ limit: 50 }) });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to delete message",
        variant: "destructive",
      });
    }
  };

  const handleUpdateMood = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await updateMoodMutation.mutateAsync({
        username: user.username,
        data: { mood: newMood || null },
      });
      setIsEditingMood(false);
      queryClient.invalidateQueries({ queryKey: getGetMeQueryKey() });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update mood",
        variant: "destructive",
      });
    }
  };

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
    >
      {/* Left Column: Profile Preview & Online Users */}
      <div className="flex flex-col gap-6">
        {/* Profile Preview */}
        <div className="retro-container bg-card p-4 flex flex-col items-center">
          <Avatar className="w-24 h-24 mb-4 border-2 border-primary rounded-none">
            <AvatarImage src={user.avatarUrl || undefined} />
            <AvatarFallback className="rounded-none bg-muted text-muted-foreground text-2xl">
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <Link href={`/profile/${user.username}`} className="text-2xl font-display text-primary hover:underline hover:text-accent">
            {user.displayName}
          </Link>
          <div className="text-sm text-muted-foreground mb-4">@{user.username}</div>
          
          <div className="w-full bg-muted p-2 border border-border">
            <div className="text-xs text-secondary mb-1">Current Mood:</div>
            {isEditingMood ? (
              <form onSubmit={handleUpdateMood} className="flex gap-2">
                <Input
                  value={newMood}
                  onChange={(e) => setNewMood(e.target.value)}
                  placeholder="how are u feeling?"
                  className="h-8 text-xs bg-background border-primary text-foreground rounded-none"
                  autoFocus
                />
                <Button type="submit" size="sm" className="h-8 rounded-none bg-primary text-primary-foreground px-2" disabled={updateMoodMutation.isPending}>Save</Button>
                <Button type="button" size="sm" variant="ghost" className="h-8 rounded-none px-2" onClick={() => setIsEditingMood(false)}>X</Button>
              </form>
            ) : (
              <div className="flex justify-between items-center group">
                <span className="text-foreground text-sm italic">{user.mood ? `"${user.mood}"` : "no mood set :("}</span>
                <Button variant="link" size="sm" className="h-6 px-2 opacity-0 group-hover:opacity-100 transition-opacity text-primary" onClick={() => { setNewMood(user.mood || ""); setIsEditingMood(true); }}>edit</Button>
              </div>
            )}
          </div>
        </div>

        {/* Online Users Panel */}
        <div className="retro-container bg-card p-4 flex flex-col h-64">
          <div className="text-xl font-display text-secondary mb-2 border-b border-secondary pb-1">Users Online ({onlineUsers?.length || 0})</div>
          <div className="flex-1 overflow-y-auto pr-2 space-y-2 scrollbar-retro">
            {isLoadingOnline ? (
              <div className="text-muted-foreground animate-pulse text-sm">Scanning network...</div>
            ) : onlineUsers?.length === 0 ? (
              <div className="text-muted-foreground text-sm">Nobody else is online x_x</div>
            ) : (
              onlineUsers?.map(ou => (
                <div key={ou.id} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_5px_#0f0]"></div>
                  <Link href={`/profile/${ou.username}`} className="text-foreground hover:text-secondary truncate">
                    {ou.displayName} <span className="text-muted-foreground text-xs">(@{ou.username})</span>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Shoutbox */}
      <div className="md:col-span-2 flex flex-col h-[calc(100vh-12rem)] min-h-[500px]">
        <div className="retro-container bg-card p-4 flex-1 flex flex-col">
          <div className="text-2xl font-display text-primary mb-4 border-b-2 border-primary pb-2 shadow-primary drop-shadow-[0_0_5px_rgba(255,0,255,0.5)]">
            == GLOBAL SHOUTBOX ==
          </div>
          
          <div ref={shoutboxRef} className="flex-1 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-retro">
            {isLoadingShouts ? (
              <div className="text-center text-muted-foreground my-10 animate-pulse font-mono">Loading messages...</div>
            ) : shoutboxMessages?.length === 0 ? (
              <div className="text-center text-muted-foreground my-10 font-mono">Be the first to shout!</div>
            ) : (
              shoutboxMessages?.map(msg => (
                <div key={msg.id} className="text-sm font-mono break-words leading-relaxed group">
                  <span className="text-muted-foreground mr-2">[{format(new Date(msg.createdAt), 'HH:mm:ss')}]</span>
                  <Link href={`/profile/${msg.username}`} className="font-bold hover:underline" style={{ color: msg.color || "var(--color-primary)" }}>
                    &lt;{msg.displayName}&gt;
                  </Link>
                  <span className="ml-2 text-foreground">{msg.message}</span>
                  {msg.username === user.username && (
                    <button 
                      onClick={() => handleDeleteShout(msg.id)}
                      className="ml-2 text-xs text-destructive opacity-0 group-hover:opacity-100 hover:underline"
                      disabled={deleteShoutMutation.isPending}
                    >
                      [x]
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          <form onSubmit={handlePostShout} className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Shout something..."
              className="flex-1 bg-background border-2 border-primary text-foreground rounded-none focus-visible:ring-0 focus-visible:border-accent"
              maxLength={500}
            />
            <Button 
              type="submit" 
              disabled={postShoutMutation.isPending || !newMessage.trim()}
              className="rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-bold tracking-wider border-2 border-transparent"
            >
              SEND
            </Button>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

import { useParams, Link } from "wouter";
import { useGetUser, useAddBuddy, useRemoveBuddy, useGetBuddyList, getGetBuddyListQueryKey } from "@workspace/api-client-react";
import { useSession } from "@/hooks/use-session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { motion } from "framer-motion";
import { useDM } from "@/context/dm-context";

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const { user: currentUser } = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: profile, isLoading, error } = useGetUser(username || "", {
    query: { enabled: !!username }
  });

  const { data: myBuddies } = useGetBuddyList(currentUser?.username || "", {
    query: { enabled: !!currentUser?.username }
  });

  const { openChat } = useDM();
  const addBuddyMutation = useAddBuddy();
  const removeBuddyMutation = useRemoveBuddy();

  if (isLoading) {
    return <div className="text-center text-primary mt-10 animate-pulse font-display text-2xl">LOADING PROFILE...</div>;
  }

  if (error || !profile) {
    return <div className="text-center text-destructive mt-10 font-display text-2xl">User not found x_x</div>;
  }

  const isMe = currentUser?.username === profile.username;
  const isBuddy = myBuddies?.some(b => b.username === profile.username);

  const handleToggleBuddy = async () => {
    if (!currentUser) return;
    try {
      if (isBuddy) {
        await removeBuddyMutation.mutateAsync({ username: currentUser.username, buddyUsername: profile.username });
      } else {
        await addBuddyMutation.mutateAsync({ username: currentUser.username, data: { buddyUsername: profile.username } });
      }
      queryClient.invalidateQueries({ queryKey: getGetBuddyListQueryKey(currentUser.username) });
      toast({
        title: isBuddy ? "Buddy Removed" : "Buddy Added!",
        description: `${profile.displayName} ${isBuddy ? "is no longer your buddy :(" : "is now your buddy! :)"}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to update buddy list",
        variant: "destructive"
      });
    }
  };

  const bgColor = profile.profileColor || "var(--color-primary)";

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-3xl mx-auto w-full"
    >
      <div 
        className="retro-container p-6 relative overflow-hidden"
        style={{
          boxShadow: `inset 0 0 20px ${bgColor}, 0 0 20px ${bgColor}`,
          borderColor: bgColor
        }}
      >
        {/* Background Accent */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ background: `linear-gradient(45deg, transparent, ${bgColor}, transparent)` }}
        />

        <div className="relative z-10 flex flex-col md:flex-row gap-8">
          
          {/* Left Column */}
          <div className="flex flex-col items-center w-full md:w-1/3">
            <h1 className="text-3xl font-display mb-4 text-center break-words w-full" style={{ color: bgColor, textShadow: `0 0 5px ${bgColor}` }}>
              {profile.displayName}
            </h1>
            
            <Avatar className="w-48 h-48 mb-4 border-4 rounded-none shadow-lg" style={{ borderColor: bgColor, boxShadow: `0 0 15px ${bgColor}` }}>
              <AvatarImage src={profile.avatarUrl || undefined} />
              <AvatarFallback className="rounded-none bg-muted text-muted-foreground text-5xl font-display">
                {profile.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="text-center font-mono mb-4 w-full">
              <div className="text-muted-foreground text-sm">@{profile.username}</div>
              <div className="mt-2 text-sm italic">
                is feeling: {profile.mood ? `"${profile.mood}"` : "nothing in particular"}
              </div>
            </div>

            {profile.isOnline ? (
              <div className="text-green-500 font-bold text-sm mb-4 animate-pulse">[ ONLINE NOW ]</div>
            ) : (
              <div className="text-muted-foreground text-sm mb-4">Last seen: {format(new Date(profile.lastSeen), 'MMM d, yyyy')}</div>
            )}

            {!isMe && currentUser && (
              <div className="flex flex-col gap-2 w-full">
                <Button 
                  onClick={handleToggleBuddy}
                  disabled={addBuddyMutation.isPending || removeBuddyMutation.isPending}
                  className="w-full rounded-none font-bold uppercase tracking-widest border-2 transition-all hover:bg-transparent"
                  style={{ 
                    backgroundColor: isBuddy ? 'transparent' : bgColor,
                    color: isBuddy ? bgColor : '#fff',
                    borderColor: bgColor
                  }}
                >
                  {isBuddy ? "- Remove Buddy" : "+ Add Buddy"}
                </Button>
                <Button
                  onClick={() => openChat({ username: profile.username, displayName: profile.displayName, profileColor: profile.profileColor })}
                  className="w-full rounded-none font-bold uppercase tracking-widest border-2 transition-all hover:bg-transparent"
                  style={{
                    backgroundColor: "transparent",
                    color: "#00ffff",
                    borderColor: "#00ffff",
                  }}
                >
                  &gt;&gt; Send IM
                </Button>
              </div>
            )}

            <div className="mt-6 w-full bg-black/50 p-3 border border-dashed" style={{ borderColor: bgColor }}>
              <div className="text-xs uppercase tracking-widest mb-1 text-muted-foreground">Buddy Count</div>
              <div className="text-2xl font-display text-center" style={{ color: bgColor }}>{profile.buddyCount}</div>
            </div>
            
            {profile.profileSong && (
              <div className="mt-4 w-full bg-black/50 p-3 border border-dashed flex flex-col items-center" style={{ borderColor: bgColor }}>
                <div className="text-xs uppercase tracking-widest mb-1 text-muted-foreground">Profile Song</div>
                <div className="text-sm font-mono text-center truncate w-full" title={profile.profileSong}>♪ {profile.profileSong}</div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="bg-black/40 border p-4" style={{ borderColor: bgColor }}>
              <h2 className="text-xl font-display mb-2 border-b pb-1" style={{ color: bgColor, borderBottomColor: bgColor }}>About Me</h2>
              <div className="font-mono text-sm whitespace-pre-wrap min-h-[100px]">
                {profile.bio || <span className="text-muted-foreground italic">No bio provided.</span>}
              </div>
            </div>

            <div className="bg-black/40 border p-4" style={{ borderColor: bgColor }}>
              <h2 className="text-xl font-display mb-2 border-b pb-1" style={{ color: bgColor, borderBottomColor: bgColor }}>Details</h2>
              <div className="font-mono text-sm flex flex-col gap-2">
                <div>
                  <span className="text-muted-foreground uppercase mr-2 text-xs">Location:</span>
                  <span>{profile.location || "Unknown"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase mr-2 text-xs">Interests:</span>
                  <span>{profile.interests || "None specified"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground uppercase mr-2 text-xs">Member since:</span>
                  <span>{format(new Date(profile.createdAt), 'MMMM yyyy')}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </motion.div>
  );
}
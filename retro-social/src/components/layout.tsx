export function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useSession();
  const [, setLocation] = useLocation();
  const logoutMutation = useLogout();
  const queryClient = useQueryClient();

  const { data: inbox } = useGetInbox(user?.username ?? "", {
    query: { enabled: !!user?.username, refetchInterval: 10000 }
  });
  const totalUnread = inbox?.reduce((sum, c) => sum + c.unreadCount, 0) ?? 0;

  const handleLogout = async () => {
    localStorage.removeItem("retro_session_user");
    localStorage.removeItem("retro_username");
    queryClient.clear();
    window.location.href = "/login"; 
  };

  return (
    <div className="min-h-screen flex flex-col max-w-5xl mx-auto p-4 gap-4 relative z-10">
      {/* 1. We removed the "if (!user) return" and replaced it with this check */}
      {user && (
        <header className="retro-container p-4 flex justify-between items-center bg-card">
          <Link href="/home" className="text-3xl font-display text-primary tracking-widest uppercase hover:text-accent transition-colors">
            RetroSpace //
          </Link>
          
          <nav className="flex gap-4 items-center">
            <span className="text-muted-foreground text-sm hidden sm:inline-block">
              Logged in as <span className="text-foreground font-bold">{user.username}</span>
            </span>
            <Link href="/home" className="hover:text-primary transition-colors">Home</Link>
            <Link href={`/profile/${user.username}`} className="hover:text-primary transition-colors">Profile</Link>
            <Link href="/buddies" className="hover:text-primary transition-colors">Buddies</Link>
            <Link href="/inbox" className="hover:text-primary transition-colors relative">
              IMs
              {totalUnread > 0 && (
                <span style={{
                  position: "absolute",
                  top: -8,
                  right: -12,
                  background: "#ff0000",
                  color: "#fff",
                  fontFamily: "'VT323', monospace",
                  fontSize: "0.75rem",
                  borderRadius: 2,
                  padding: "0 4px",
                  lineHeight: 1.4,
                }}>
                  {totalUnread}
                </span>
              )}
            </Link>
            <Link href="/edit-profile" className="hover:text-primary transition-colors">Settings</Link>
            <Button 
              variant="ghost" 
              className="text-destructive hover:bg-destructive hover:text-destructive-foreground no-default-hover-elevate rounded-none border border-destructive" 
              onClick={handleLogout} 
              disabled={logoutMutation.isPending}
            >
              Sign Off
            </Button>
          </nav>
        </header>
      )}

      {/* 2. Main content now always has its wrapper, even if logged out */}
      <main className="flex-1 flex flex-col gap-4">
        {children}
      </main>

      <footer className="text-center text-xs text-muted-foreground p-4">
        <p>Copyright © 2003 RetroSpace Networks. All rights reserved.</p>
        <p>Best viewed in Netscape Navigator 4.0 at 800x600 resolution.</p>
      </footer>
    </div>
  );
}

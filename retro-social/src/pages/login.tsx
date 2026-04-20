import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const [loginUser, setLoginUser] = useState("");
  const [loginPass, setLoginPass] = useState("");

  const [regUser, setRegUser] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regDisplay, setRegDisplay] = useState("");

  // Mocking the loading states since we removed useAuth
  const isLoggingIn = false;
  const isRegistering = false;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fakeUser = { 
        username: loginUser, 
        displayName: loginUser,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${loginUser}` 
      };
      localStorage.setItem("retro_session_user", JSON.stringify(fakeUser));
      setLocation("/home");
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const fakeUser = { 
        username: regUser, 
        displayName: regDisplay || regUser,
        avatarUrl: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${regUser}`
      };
      localStorage.setItem("retro_session_user", JSON.stringify(fakeUser));
      setLocation("/home");
    } catch (err: any) {
      toast({
        title: "Registration Failed",
        description: "Could not create account",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen flex items-center justify-center p-4 relative z-10"
    >
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8">
        
        {/* Left Side: Login */}
        <div className="retro-container bg-card p-8 flex-1 flex flex-col items-center">
          <h1 className="text-5xl font-display text-primary mb-2 tracking-widest text-center shadow-primary drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">RetroSpace</h1>
          <p className="text-muted-foreground mb-8 text-center font-mono">Sign on to your account.</p>

          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4 font-mono">
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-user" className="text-secondary">Screen Name</Label>
              <Input 
                id="login-user"
                value={loginUser}
                onChange={(e) => setLoginUser(e.target.value)}
                className="bg-background border-primary text-foreground rounded-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="login-pass" className="text-secondary">Password</Label>
              <Input 
                id="login-pass"
                type="password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                className="bg-background border-primary text-foreground rounded-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isLoggingIn}
              className="mt-4 rounded-none bg-primary text-primary-foreground hover:bg-accent hover:text-accent-foreground font-bold tracking-widest uppercase border-2 border-transparent hover:border-foreground transition-all"
            >
              {isLoggingIn ? "Connecting..." : "Sign On"}
            </Button>
          </form>
        </div>

        {/* Right Side: Register */}
        <div className="retro-container bg-card p-8 flex-1 flex flex-col items-center border-secondary! shadow-[inset_0_0_10px_var(--color-secondary),0_0_10px_var(--color-secondary)]!">
          <h2 className="text-3xl font-display text-secondary mb-2 tracking-widest text-center shadow-secondary drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">New User?</h2>
          <p className="text-muted-foreground mb-8 text-center font-mono">Create a screen name today!</p>

          <form onSubmit={handleRegister} className="w-full flex flex-col gap-4 font-mono">
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-user" className="text-primary">Screen Name</Label>
              <Input 
                id="reg-user"
                value={regUser}
                onChange={(e) => setRegUser(e.target.value)}
                className="bg-background border-secondary text-foreground rounded-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-display" className="text-primary">Display Name</Label>
              <Input 
                id="reg-display"
                value={regDisplay}
                onChange={(e) => setRegDisplay(e.target.value)}
                className="bg-background border-secondary text-foreground rounded-none"
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="reg-pass" className="text-primary">Password</Label>
              <Input 
                id="reg-pass"
                type="password"
                value={regPass}
                onChange={(e) => setRegPass(e.target.value)}
                className="bg-background border-secondary text-foreground rounded-none"
                required
              />
            </div>
            <Button 
              type="submit" 
              disabled={isRegistering}
              className="mt-4 rounded-none bg-secondary text-secondary-foreground hover:bg-primary hover:text-primary-foreground font-bold tracking-widest uppercase border-2 border-transparent hover:border-foreground transition-all"
            >
              {isRegistering ? "Creating..." : "Register"}
            </Button>
          </form>
        </div>

      </div>
    </motion.div>
  );
}

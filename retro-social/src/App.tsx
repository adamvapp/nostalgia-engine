import { Switch, Route, Router as WouterRouter, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Home from "@/pages/home";
import Profile from "@/pages/profile";
import Buddies from "@/pages/buddies";
import EditProfile from "@/pages/edit-profile";
import Inbox from "@/pages/inbox";
import { Layout } from "@/components/layout";
import { useSession } from "@/hooks/use-session";
import { useEffect } from "react";
import { DMProvider } from "@/context/dm-context";
import { ChatWindowsContainer } from "@/components/chat-windows-container";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component, ...rest }: any) {
  const { isAuthenticated, isLoading } = useSession();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setLocation("/");
    }
  }, [isLoading, isAuthenticated, setLocation]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center text-primary font-display text-3xl animate-pulse">CONNECTING...</div>;
  }

  if (!isAuthenticated) return null;

  return <Component {...rest} />;
}

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Login} />
        <Route path="/home">
          <ProtectedRoute component={Home} />
        </Route>
        <Route path="/profile/:username">
          <ProtectedRoute component={Profile} />
        </Route>
        <Route path="/buddies">
          <ProtectedRoute component={Buddies} />
        </Route>
        <Route path="/edit-profile">
          <ProtectedRoute component={EditProfile} />
        </Route>
        <Route path="/inbox">
          <ProtectedRoute component={Inbox} />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <DMProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
            <ChatWindowsContainer />
          </WouterRouter>
        </DMProvider>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

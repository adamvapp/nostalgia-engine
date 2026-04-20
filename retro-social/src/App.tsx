import { Switch, Route } from "wouter";
import { Layout } from "@/components/layout";
import Home from "@/pages/home";
import Login from "@/pages/login";
import Inbox from "@/pages/inbox";
import Profile from "@/pages/profile";
import Buddies from "@/pages/buddies";
import EditProfile from "@/pages/edit-profile";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Layout>
      <Switch>
        {/* Map both / and /login to the Login page */}
        <Route path="/" component={Login} />
        <Route path="/login" component={Login} />
        
        <Route path="/home" component={Home} />
        <Route path="/inbox" component={Inbox} />
        <Route path="/buddies" component={Buddies} />
        <Route path="/edit-profile" component={EditProfile} />
        
        {/* This handles the Profile page with a username parameter */}
        <Route path="/profile/:username" component={Profile} />
        
        {/* Default 404 handler */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default Router;

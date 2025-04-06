import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Playbook from "@/pages/Playbook";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  component: React.ComponentType;
}

// This component will redirect to login if the user is not authenticated
const ProtectedRoute = ({ component: Component }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    setLocation("/login");
    return null;
  }

  return (
    <AppShell>
      <Component />
    </AppShell>
  );
};

// This component will redirect to dashboard if the user is already authenticated
const PublicRoute = ({ component: Component }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (user) {
    setLocation("/dashboard");
    return null;
  }

  return <Component />;
};

function Router() {
  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login">
        <PublicRoute component={Login} />
      </Route>
      
      {/* Protected Routes */}
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} />
      </Route>
      <Route path="/playbook">
        <ProtectedRoute component={Playbook} />
      </Route>
      <Route path="/library">
        <ProtectedRoute component={Library} />
      </Route>
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      
      {/* Redirect root to dashboard */}
      <Route path="/">
        <Redirect to="/dashboard" />
      </Route>
      
      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

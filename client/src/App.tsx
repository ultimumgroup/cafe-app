import { Switch, Route, Redirect, useLocation } from "wouter";
import { useEffect } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Playbook from "@/pages/Playbook";
import Library from "@/pages/Library";
import Settings from "@/pages/Settings";
import Invites from "@/pages/Invites";
import Tasks from "@/pages/Tasks";
import Admin from "@/pages/Admin";
import RegisterWithInvite from "@/pages/RegisterWithInvite";
import AuthCallback from "@/pages/AuthCallback";
import AppShell from "@/components/layout/AppShell";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import RoleBasedRedirect from "@/components/auth/RoleBasedRedirect";

interface ProtectedRouteProps {
  component: React.ComponentType;
  allowedRoles?: string[];
}

// This component will redirect to login if the user is not authenticated
// It also checks if the user role is allowed to access the route
const ProtectedRoute = ({ component: Component, allowedRoles }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Fix for the "setState during render" warning - use useEffect for navigation
  useEffect(() => {
    if (!loading && !user) {
      setLocation("/login");
      return;
    }

    // If roles are specified, check if the user has the required role
    if (!loading && user && allowedRoles && !allowedRoles.includes(user.role)) {
      // Redirect based on role
      if (user.role === 'superadmin') {
        setLocation("/admin");
      } else if (user.role === 'staff') {
        setLocation("/tasks");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [loading, user, allowedRoles, setLocation]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Redirecting to login...</div>;
  }

  // Check if the user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <div className="flex h-screen items-center justify-center">Access denied. Redirecting...</div>;
  }

  return (
    <AppShell>
      <Component />
    </AppShell>
  );
};

// This component will redirect to the appropriate page based on user role if already authenticated
const PublicRoute = ({ component: Component }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  // Fix for the "setState during render" warning - use useEffect for navigation
  useEffect(() => {
    if (!loading && user) {
      // Redirect based on role
      if (user.role === 'superadmin') {
        setLocation("/admin");
      } else if (user.role === 'staff') {
        setLocation("/tasks");
      } else {
        setLocation("/dashboard");
      }
    }
  }, [loading, user, setLocation]);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (user) {
    return <div className="flex h-screen items-center justify-center">Redirecting...</div>;
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

      {/* Invite Registration Route */}
      <Route path="/register/:token">
        <RegisterWithInvite />
      </Route>

      {/* Auth callback route for OAuth providers like Google */}
      <Route path="/auth/callback">
        <AuthCallback />
      </Route>
      
      {/* Role-based Protected Routes */}
      <Route path="/admin">
        <ProtectedRoute component={Admin} allowedRoles={['superadmin']} />
      </Route>
      
      <Route path="/dashboard">
        <ProtectedRoute component={Dashboard} allowedRoles={['owner', 'gm', 'superadmin']} />
      </Route>
      
      <Route path="/tasks">
        <ProtectedRoute component={Tasks} allowedRoles={['staff', 'owner', 'gm', 'superadmin']} />
      </Route>
      
      <Route path="/playbook">
        <ProtectedRoute component={Playbook} />
      </Route>
      
      <Route path="/library">
        <ProtectedRoute component={Library} />
      </Route>
      
      <Route path="/invites">
        <ProtectedRoute component={Invites} allowedRoles={['owner', 'gm', 'superadmin']} />
      </Route>
      
      <Route path="/settings">
        <ProtectedRoute component={Settings} />
      </Route>
      
      {/* Redirect root to role-based destination */}
      <Route path="/">
        <RoleBasedRedirect />
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

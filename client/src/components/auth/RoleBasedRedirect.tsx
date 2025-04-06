import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface RoleBasedRedirectProps {
  children?: React.ReactNode;
}

export default function RoleBasedRedirect({ children }: RoleBasedRedirectProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [isRedirecting, setIsRedirecting] = useState(true);

  useEffect(() => {
    // Wait until auth is no longer loading
    if (!loading && user) {
      let targetRoute = '/dashboard'; // Default route

      // Redirect based on role
      if (user.role === 'superadmin') {
        targetRoute = '/admin';
      } else if (user.role === 'staff') {
        targetRoute = '/tasks';
      } else if (user.role === 'owner' || user.role === 'gm') {
        targetRoute = '/dashboard';
      }

      // Set a short timeout to avoid immediate redirects that might confuse users
      const redirectTimeout = setTimeout(() => {
        setLocation(targetRoute);
        setIsRedirecting(false);
      }, 800);

      return () => clearTimeout(redirectTimeout);
    } else if (!loading && !user) {
      // If not loading and no user, they should go to login
      setLocation('/login');
      setIsRedirecting(false);
    } else if (!loading) {
      // Not loading but we're not redirecting anywhere
      setIsRedirecting(false);
    }
  }, [loading, user, setLocation]);

  if (loading || isRedirecting) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-background">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-lg">Preparing your workspace...</p>
      </div>
    );
  }

  return children || null;
}
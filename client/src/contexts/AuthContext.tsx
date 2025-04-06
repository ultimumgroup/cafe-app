import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, getCurrentUser, login, loginWithGoogle, logout, saveUser, hasRole } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import { createClient } from "@/lib/supabase";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<{ error: string | null }>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const supabase = createClient();

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener for Supabase
    try {
      // Explicitly type the callback parameters
      const response = supabase.auth.onAuthStateChange(
        async (event: string, session: any) => {
          if (event === 'SIGNED_IN' && session?.user) {
            // User signed in, fetch from our database first
            try {
              // First, check if user exists in our database by authId
              const userResult = await supabase
                .from('users')
                .select('*')
                .eq('authId', session.user.id)
                .single();
              
              // Safely access the data property for users query
              const userData = userResult && userResult.data ? userResult.data : null;
              
              // If the user is properly linked in our database
              if (userData) {
                const authUser: AuthUser = {
                  id: userData.id,
                  email: session.user.email || '',
                  username: userData.username || session.user.email?.split('@')[0] || 'User',
                  role: userData.role || 'staff',
                  avatar: session.user.user_metadata?.avatar_url,
                  restaurantId: userData.restaurantId,
                  authId: session.user.id,
                };
                
                setUser(authUser);
                saveUser(authUser);
              } else {
                // Fallback to profile data if available
                const profileResult = await supabase
                  .from('profiles')
                  .select('*')
                  .eq('id', session.user.id)
                  .single();
                
                // Safely access the data property for profiles query
                const profileData = profileResult && profileResult.data ? profileResult.data : null;
                
                if (profileData) {
                  const authUser: AuthUser = {
                    id: profileData.id,
                    email: session.user.email || '',
                    username: profileData.username || session.user.email?.split('@')[0] || 'User',
                    role: profileData.role || 'staff',
                    avatar: profileData.avatar_url,
                    restaurantId: profileData.restaurant_id,
                    authId: session.user.id,
                  };
                  
                  setUser(authUser);
                  saveUser(authUser);
                } else {
                  // Basic user from auth if no linked profiles/users found
                  const authUser: AuthUser = {
                    id: 0, // Temporary ID, should be replaced when user data is properly created
                    email: session.user.email || '',
                    username: session.user.email?.split('@')[0] || 'User',
                    role: 'staff', // Default role
                    avatar: session.user.user_metadata?.avatar_url,
                    authId: session.user.id,
                  };
                  
                  setUser(authUser);
                  saveUser(authUser);
                  
                  // Show a toast to indicate the user record needs to be created
                  toast({
                    title: "Account Setup Required",
                    description: "Your user account needs to be linked to your organization",
                    variant: "default",
                  });
                }
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
              
              // Fallback to basic auth user
              const authUser: AuthUser = {
                id: parseInt(session.user.id),
                email: session.user.email || '',
                username: session.user.email?.split('@')[0] || 'User',
                role: 'staff', // Default role
                avatar: session.user.user_metadata?.avatar_url,
                authId: session.user.id,
              };
              
              setUser(authUser);
              saveUser(authUser);
            }
          } else if (event === 'SIGNED_OUT') {
            // User signed out
            setUser(null);
            localStorage.removeItem('auth_user');
          }
        }
      );

      // Store the subscription for cleanup
      const subscription = response.data.subscription;

      // Load user from localStorage on initial render
      const loadUser = async () => {
        // First try to get from localStorage (faster UX)
        const localUser = getCurrentUser();
        
        if (localUser) {
          setUser(localUser);
        }

        try {
          // Then check Supabase session for verification
          const sessionResponse = await supabase.auth.getSession();
          const session = sessionResponse?.data?.session;
          
          if (!session) {
            // No active session, clear any local user
            if (localUser) {
              setUser(null);
              localStorage.removeItem('auth_user');
            }
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
        
        setLoading(false);
      };

      loadUser();

      // Return cleanup function
      return () => {
        if (subscription) {
          subscription.unsubscribe();
        }
      };
    } catch (error) {
      console.error('Error setting up auth state listener:', error);
      setLoading(false);
      
      // Return empty cleanup function
      return () => {};
    }
  }, []);

  const handleLogin = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    try {
      const { user: authUser, error } = await login({ email, password });
      
      if (error || !authUser) {
        toast({
          title: "Login failed",
          description: error || "Invalid credentials",
          variant: "destructive",
        });
        setLoading(false);
        return false;
      }
      
      setUser(authUser);
      saveUser(authUser);
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login error", error);
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      setLoading(false);
      return false;
    }
  };

  const handleGoogleLogin = async (): Promise<{ error: string | null }> => {
    try {
      return await loginWithGoogle();
    } catch (error) {
      console.error("Google login error", error);
      return { error: "Failed to log in with Google" };
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("Logout error", error);
      toast({
        title: "Logout failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  const checkRole = (role: string): boolean => {
    return hasRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login: handleLogin,
        loginWithGoogle: handleGoogleLogin,
        logout: handleLogout,
        hasRole: checkRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { AuthUser, getCurrentUser, login, logout, saveUser, hasRole } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Load user from localStorage on initial render
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    loadUser();
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

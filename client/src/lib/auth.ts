import { createClient } from "./supabase";
import { UserRole } from "@shared/schema";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  restaurantId?: number;
  authId?: string; // Supabase Auth UUID
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

const supabase = createClient();

// Hybrid approach: 
// 1. Try to use Supabase for auth operations
// 2. Fall back to local API if Supabase fails or for development

export const login = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
    // Try to use Supabase for authentication
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.warn('Supabase auth failed, falling back to local API', authError);
      
      // Fall back to local API
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        return { user: null, error: error.message || 'Login failed' };
      }

      const data = await response.json();
      return { user: data.user, error: null };
    }
    
    // Supabase auth successful, get user data from profiles table
    if (authData?.user) {
      try {
        const result = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();
        
        // Make sure result is not null before accessing data
        if (result && result.data) {
          const profileData = result.data;
          
          const user: AuthUser = {
            id: profileData.id,
            email: authData.user.email || '',
            username: profileData.username || authData.user.email?.split('@')[0] || 'User',
            role: profileData.role || UserRole.STAFF,
            avatar: profileData.avatar_url,
            restaurantId: profileData.restaurant_id,
            // Store the Supabase auth ID to map with our database auth_id
            authId: authData.user.id,
          };
          
          return { user, error: null };
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    }
    
    // If we can't get the profile, create a basic user from auth data
    if (authData?.user) {
      const user: AuthUser = {
        id: parseInt(authData.user.id),
        email: authData.user.email || '',
        username: authData.user.email?.split('@')[0] || 'User',
        role: UserRole.STAFF, // Default role
        avatar: authData.user.user_metadata?.avatar_url,
        authId: authData.user.id,
      };
      
      return { user, error: null };
    }
    
    return { user: null, error: 'Authentication failed' };
  } catch (error) {
    console.error('Login error:', error);
    return { user: null, error: 'Authentication error occurred' };
  }
};

export const loginWithGoogle = async (): Promise<{ error: string | null }> => {
  try {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/auth/callback',
      },
    });
    
    if (error) {
      return { error: error.message };
    }
    
    return { error: null };
  } catch (error) {
    console.error('Google login error:', error);
    return { error: 'Google login failed' };
  }
};

export const logout = async (): Promise<void> => {
  try {
    // Try to use Supabase for logout
    await supabase.auth.signOut();
  } catch (error) {
    console.error('Supabase logout error, clearing local storage', error);
  }
  
  // Always clear local storage as a fallback
  localStorage.removeItem('auth_user');
};

export const getCurrentUser = (): AuthUser | null => {
  const userJson = localStorage.getItem('auth_user');
  if (!userJson) return null;
  
  try {
    return JSON.parse(userJson) as AuthUser;
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
    return null;
  }
};

export const saveUser = (user: AuthUser): void => {
  localStorage.setItem('auth_user', JSON.stringify(user));
};

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser();
};

export const hasRole = (requiredRole: string): boolean => {
  const user = getCurrentUser();
  if (!user) return false;
  
  // Role hierarchy
  const roles = {
    [UserRole.SUPER_ADMIN]: 4,
    [UserRole.OWNER]: 3,
    [UserRole.GENERAL_MANAGER]: 2,
    [UserRole.STAFF]: 1,
  };
  
  // Check if user's role level is greater than or equal to the required role level
  return (roles[user.role as keyof typeof roles] || 0) >= (roles[requiredRole as keyof typeof roles] || 0);
};

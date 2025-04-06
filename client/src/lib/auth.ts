import { createClient } from "./supabase";
import { UserRole } from "@shared/schema";

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: string;
  avatar?: string;
  restaurantId?: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  user: AuthUser | null;
  error: string | null;
}

// For development/demo purposes, we're using the local API
// In production, this would be replaced with Supabase auth

export const login = async ({ email, password }: LoginCredentials): Promise<AuthResponse> => {
  try {
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
  } catch (error) {
    return { user: null, error: 'Network error occurred' };
  }
};

export const logout = async (): Promise<void> => {
  // In a real app with Supabase, we would call supabase.auth.signOut()
  // For now, we'll just clear the user from localStorage
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

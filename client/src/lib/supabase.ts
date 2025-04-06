import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { UserRole } from '@shared/schema';

// Initialize the Supabase client with env variables
export const createClient = () => {
  // Use environment variables if available - only use import.meta for browser
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 
                     import.meta.env.SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 
                         import.meta.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Using mock client.');
    // Fallback to mock client for development if env vars are missing
    return {
      auth: {
        signInWithPassword: async () => {
          console.warn('Mock: signInWithPassword called');
          // Return a mock successful response with demo user
          return {
            data: {
              user: {
                id: '1',
                email: 'manager@pastaparadise.com',
                user_metadata: {
                  avatar_url: 'https://ui-avatars.com/api/?name=Manager&background=random'
                }
              },
              session: {
                access_token: 'mock-token',
                expires_at: Date.now() + 3600000
              }
            },
            error: null
          };
        },
        signInWithOAuth: async () => {
          console.warn('Mock: signInWithOAuth called');
          return { error: null };
        },
        signOut: async () => {
          console.warn('Mock: signOut called');
          return { error: null };
        },
        getUser: async () => {
          console.warn('Mock: getUser called');
          return { 
            data: { 
              user: {
                id: '1',
                email: 'manager@pastaparadise.com'
              }
            },
            error: null 
          };
        },
        getSession: async () => {
          console.warn('Mock: getSession called');
          return { 
            data: { 
              session: {
                user: {
                  id: '1',
                  email: 'manager@pastaparadise.com'
                }
              }
            }, 
            error: null 
          };
        },
        onAuthStateChange: (callback: (event: string, session: any) => void) => {
          console.warn('Mock: onAuthStateChange called');
          // Call the callback once with a mock signed-in state
          setTimeout(() => {
            callback('SIGNED_IN', {
              user: {
                id: '1',
                email: 'manager@pastaparadise.com',
                user_metadata: {
                  avatar_url: 'https://ui-avatars.com/api/?name=Manager&background=random'
                }
              }
            });
          }, 100);
          
          // Return a mock subscription that does nothing
          return {
            data: {
              subscription: {
                unsubscribe: () => {
                  console.warn('Mock: unsubscribe called');
                }
              }
            }
          };
        }
      },
      from: (table: string) => {
        console.warn(`Mock: from('${table}') called`);
        return {
          select: (fields: string) => {
            console.warn(`Mock: select('${fields}') called`);
            return {
              eq: (field: string, value: string | number) => {
                console.warn(`Mock: eq('${field}', '${value}') called`);
                return {
                  single: async () => {
                    console.warn('Mock: single() called');
                    
                    // Return mock profile data for the profiles table
                    if (table === 'profiles') {
                      return {
                        data: {
                          id: 1,
                          username: 'manager',
                          role: UserRole.GENERAL_MANAGER,
                          avatar_url: 'https://ui-avatars.com/api/?name=Manager&background=random',
                          restaurant_id: 1
                        },
                        error: null
                      };
                    }
                    
                    return { data: null, error: null };
                  },
                  data: null,
                  error: null
                };
              }
            };
          },
          insert: () => ({
            values: () => ({
              select: () => ({
                single: async () => ({ data: null, error: null })
              })
            })
          }),
          update: () => ({
            eq: () => ({
              select: () => ({
                single: async () => ({ data: null, error: null })
              })
            })
          }),
          delete: () => ({
            eq: () => ({ data: null, error: null })
          })
        };
      }
    };
  }
  
  // If we have the environment variables, create a real client
  return createSupabaseClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  });
};

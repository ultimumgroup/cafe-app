// This file will be used when implementing actual Supabase integration
// For now, we're using the local API for development/demo purposes

export const createClient = () => {
  // This would be replaced with actual Supabase client initialization
  // return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
  
  console.warn('Supabase client not initialized - using local API for demo');
  
  return {
    auth: {
      signIn: async () => {
        throw new Error('Supabase auth not implemented yet');
      },
      signOut: async () => {
        throw new Error('Supabase auth not implemented yet');
      },
    },
  };
};

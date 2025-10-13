import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

// Client-side Supabase client (uses anon key)
export const createClientSupabase = () => {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};

// Server-side Supabase client with admin privileges (uses service role key)
export const createServerSupabase = () => {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  
  console.log('🔌 SUPABASE CLIENT INITIALIZATION:', {
    url,
    hasServiceKey: !!key,
    keyLength: key?.length,
    keyPrefix: key?.substring(0, 20) + '...',
  });

  return createClient<Database>(url, key, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
};

// Default export for server actions
export const supabase = createServerSupabase();

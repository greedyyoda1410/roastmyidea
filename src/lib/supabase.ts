import { createClient } from '@supabase/supabase-js';

// Lazy initialization to avoid build-time errors
let supabaseInstance: ReturnType<typeof createClient> | null = null;

export const supabase = (() => {
  if (typeof window === 'undefined') {
    // Server-side: create on demand
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    return createClient(url, key);
  }
  
  // Client-side: singleton
  if (!supabaseInstance) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    supabaseInstance = createClient(url, key);
  }
  return supabaseInstance;
})();

// For server-side operations only
// This should not be imported in client components
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!url || !serviceKey) {
    throw new Error('Supabase environment variables not configured');
  }
  
  return createClient(url, serviceKey);
}

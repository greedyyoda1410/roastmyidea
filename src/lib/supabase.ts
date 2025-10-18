import { createClient } from '@supabase/supabase-js';

// Lazy client initialization to handle missing env vars gracefully
let supabaseInstance: ReturnType<typeof createClient> | null = null;

function initSupabase() {
  if (supabaseInstance) return supabaseInstance;
  
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key) {
    console.error('Supabase environment variables missing:', { 
      hasUrl: !!url, 
      hasKey: !!key 
    });
    throw new Error('Supabase not configured. Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your environment variables.');
  }
  
  supabaseInstance = createClient(url, key);
  return supabaseInstance;
}

// Export getter function
export const getSupabase = () => initSupabase();

// For backward compatibility - but will throw if env vars missing
export const supabase = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const client = initSupabase();
    return client[prop as keyof typeof client];
  }
});

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

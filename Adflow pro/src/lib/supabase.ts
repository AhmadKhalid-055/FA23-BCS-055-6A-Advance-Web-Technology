import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Has Anon Key:', !!supabaseAnonKey);
console.log('Has Service Key:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Client-side Supabase instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  global: {
    fetch: fetch.bind(globalThis),
  },
});

// Server-side Supabase instance (for API routes)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  global: {
    fetch: fetch.bind(globalThis),
  },
});

export type Database = any; // Replace with your generated database types if using Supabase codegen

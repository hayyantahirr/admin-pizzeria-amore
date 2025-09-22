// lib/supabaseClient.js
import { createBrowserClient } from "@supabase/ssr"

// This creates a Supabase client that works in the browser (client components)
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Export a function to create a client for use in components
export function createClient() {
  return supabase;
}

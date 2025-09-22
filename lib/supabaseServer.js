// lib/supabaseServer.js
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

// This creates Supabase client for the SERVER (SSR)
export async function createClient() {
  const cookieStore =await  cookies() // Next.js cookies API

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value
        },
      },
    }
  )
}

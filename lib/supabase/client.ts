"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a single supabase client for the entire client-side application
let supabaseInstance: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClientComponentClient<Database>({
        options: {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true,
          },
        },
      })
    } catch (error) {
      console.error("Failed to initialize Supabase client:", error)
      throw error
    }
  }
  return supabaseInstance
}

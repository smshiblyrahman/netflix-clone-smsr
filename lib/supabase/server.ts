import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

export const createClient = () => {
  try {
    const cookieStore = cookies()
    return createServerComponentClient<Database>({
      cookies: () => cookieStore,
    })
  } catch (error) {
    console.error("Failed to initialize Supabase server client:", error)
    throw error
  }
}

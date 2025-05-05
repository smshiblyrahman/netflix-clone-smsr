import { createClient } from "@/lib/supabase/client"

export async function getCurrentUser() {
  const supabase = createClient()

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession()

    if (sessionError) {
      console.error("Error getting session:", sessionError)
      return null
    }

    if (!session) {
      return null
    }

    try {
      const { data: user, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (error || !user) {
        console.error("Error getting user profile:", error)
        return {
          ...session.user,
          email: session.user.email,
          subscription_status: "active",
          subscription_tier: "basic",
        }
      }

      return {
        ...user,
        email: session.user.email,
      }
    } catch (profileError) {
      console.error("Error fetching profile:", profileError)
      // Return basic user info from session if profile fetch fails
      return {
        ...session.user,
        email: session.user.email,
        subscription_status: "active",
        subscription_tier: "basic",
      }
    }
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function signOut() {
  const supabase = createClient()
  try {
    await supabase.auth.signOut({ scope: "global" })
  } catch (error) {
    console.error("Error signing out:", error)
  }
}

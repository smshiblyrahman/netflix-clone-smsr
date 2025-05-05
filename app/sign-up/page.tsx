"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NetflixLogo } from "@/components/ui/netflix-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClient } from "@/lib/supabase/client"

export default function SignUp() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRedirecting, setIsRedirecting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  // Check if user is already signed in
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("Session check error:", error)
          return
        }

        if (data.session) {
          router.push("/browse")
        }
      } catch (err) {
        console.error("Unexpected error checking session:", err)
      }
    }

    checkSession()
  }, [router, supabase])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Check if password is strong enough
      if (password.length < 6) {
        throw new Error("Password must be at least 6 characters long")
      }

      // Sign up with Supabase Auth
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (signUpError) throw signUpError

      if (data.user) {
        // Check if email confirmation is required
        if (!data.session) {
          // Email confirmation required
          router.push("/sign-up/confirmation?email=" + encodeURIComponent(email))
        } else {
          // No email confirmation required, user is signed in
          setIsRedirecting(true)
          router.push("/browse")
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred during sign up")
      console.error("Sign up error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <NetflixLogo />
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/80 p-8 rounded-md">
          <h1 className="text-3xl font-bold mb-6">Sign Up</h1>

          {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="bg-gray-700 border-gray-600"
              />
              <p className="text-xs text-gray-400 mt-1">Password must be at least 6 characters long</p>
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing Up..." : "Sign Up"}
            </Button>
          </form>

          <p className="mt-4 text-gray-400">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-white hover:underline">
              Sign in now
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

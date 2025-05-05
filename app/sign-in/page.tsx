"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { NetflixLogo } from "@/components/ui/netflix-logo"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client"

export default function SignIn() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
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

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // Try to sign in with provided credentials
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) throw signInError

      if (data.session) {
        setIsRedirecting(true)
        // Redirect to browse page
        router.push("/browse")
      }
    } catch (err: any) {
      console.error("Sign in error:", err)

      // Check if the error is because the user doesn't exist
      if (err.message?.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please try again.")
      } else {
        setError(err.message || "Failed to sign in. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  // For demo purposes, let's add a function to sign in with a mock user
  const handleDemoSignIn = async () => {
    setLoading(true)
    setError(null)

    try {
      // Use test1@example.com with password123 (from our seed data)
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: "test1@example.com",
        password: "password123",
      })

      if (signInError) throw signInError

      if (data.session) {
        setIsRedirecting(true)
        router.push("/browse")
      }
    } catch (err: any) {
      setError("Demo sign in failed. Please try regular sign in.")
      console.error("Demo sign in error:", err)
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
          <h1 className="text-3xl font-bold mb-6">Sign In</h1>

          {error && <div className="bg-red-900/50 text-red-200 p-3 rounded mb-4">{error}</div>}

          <form onSubmit={handleSignIn} className="space-y-4">
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
                className="bg-gray-700 border-gray-600"
              />
            </div>

            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
            </Button>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={rememberMe}
                  onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                />
                <Label htmlFor="remember" className="text-gray-400">
                  Remember me
                </Label>
              </div>

              <Link href="#" className="text-gray-400 hover:underline text-sm">
                Need help?
              </Link>
            </div>
          </form>

          <div className="mt-6">
            <Button onClick={handleDemoSignIn} variant="outline" className="w-full border-gray-600" disabled={loading}>
              Demo Sign In (No Registration Required)
            </Button>
          </div>

          <p className="mt-4 text-gray-400">
            New to Net-Free?{" "}
            <Link href="/sign-up" className="text-white hover:underline">
              Sign up now
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
}

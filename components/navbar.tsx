"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { NetflixLogo } from "@/components/ui/netflix-logo"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import type { MockUser } from "@/lib/supabase/mock-data"
import { SearchBar } from "@/components/search-bar"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [isSigningOut, setIsSigningOut] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) setIsLoggedIn(false)
          return
        }

        if (mounted) setIsLoggedIn(!!data.session)

        if (!data.session && mounted) {
          // If no authenticated user, use mock user
          try {
            const response = await fetch("/api/mock-users")
            const mockUsers = await response.json()
            if (mockUsers && mockUsers.length > 0 && mounted) {
              setMockUser(mockUsers[0]) // Use the first mock user
            }
          } catch (error) {
            console.error("Error fetching mock users:", error)
          }
        }
      } catch (err) {
        console.error("Unexpected error during auth check:", err)
        if (mounted) setIsLoggedIn(false)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkUser()

    // Set up auth state change listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (mounted) {
        setIsLoggedIn(!!session)

        // If user signed out, redirect to home page
        if (event === "SIGNED_OUT") {
          router.push("/")
        }
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, supabase])

  const handleSignOut = async () => {
    if (isSigningOut) return

    setIsSigningOut(true)
    try {
      // Clear any stored tokens before signing out
      await supabase.auth.signOut({ scope: "global" })
      router.push("/")
    } catch (error) {
      console.error("Error signing out:", error)
    } finally {
      setIsSigningOut(false)
    }
  }

  // Don't show navbar on sign-in and sign-up pages
  if (pathname === "/sign-in" || pathname === "/sign-up") {
    return (
      <header className="fixed w-full z-50 p-4">
        <NetflixLogo />
      </header>
    )
  }

  if (isLoading) {
    return (
      <header
        className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-transparent"}`}
      >
        <div className="flex items-center justify-between p-4 md:px-8">
          <NetflixLogo />
        </div>
      </header>
    )
  }

  return (
    <header
      className={`fixed w-full z-50 transition-colors duration-300 ${isScrolled ? "bg-black" : "bg-transparent"}`}
    >
      <div className="flex items-center justify-between p-4 md:px-8">
        <div className="flex items-center gap-8">
          <NetflixLogo />
          <nav className="hidden md:flex gap-6">
            <Link href="/browse" className="text-sm font-medium hover:text-gray-300">
              Home
            </Link>
            <Link href="/browse/tv-shows" className="text-sm font-medium hover:text-gray-300">
              TV Shows
            </Link>
            <Link href="/browse/movies" className="text-sm font-medium hover:text-gray-300">
              Movies
            </Link>
            {isLoggedIn && (
              <Link href="/browse/my-list" className="text-sm font-medium hover:text-gray-300">
                My List
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <div className="flex items-center gap-4">
              <SearchBar />
              <Link href="/profile">
                <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-700">
                  <img
                    src={mockUser?.avatar_url || "/placeholder.svg?height=32&width=32"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:text-gray-300"
                onClick={handleSignOut}
                disabled={isSigningOut}
              >
                {isSigningOut ? "Signing Out..." : "Sign Out"}
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <SearchBar />
              <Link href="/sign-in">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="primary" className="bg-primary hover:bg-primary/90">
                  Sign Up
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

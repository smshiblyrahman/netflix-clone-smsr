"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ContentSlider } from "@/components/content-slider"
import { createClient } from "@/lib/supabase/client"
import type { ContentItem, MockUser } from "@/lib/supabase/mock-data"
import { mockContent } from "@/lib/supabase/mock-data"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Billboard } from "@/components/billboard"
import { TopTenRow } from "@/components/top-ten-row"

export default function Browse() {
  const [user, setUser] = useState<any>(null)
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [content, setContent] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()

  // Use try-catch to handle potential Supabase initialization errors
  let supabase
  try {
    supabase = createClient()
  } catch (error) {
    console.error("Failed to initialize Supabase client:", error)
  }

  useEffect(() => {
    let mounted = true

    const checkUser = async () => {
      try {
        if (!supabase) {
          if (mounted) {
            setIsAuthenticated(false)
            setAuthChecked(true)
            setContent(mockContent)
            setLoading(false)
          }
          return
        }

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          if (mounted) {
            setIsAuthenticated(false)
            setAuthChecked(true)
            setContent(mockContent)
          }
          return
        }

        if (mounted) {
          setIsAuthenticated(!!data.session)
          if (data.session) {
            setUser(data.session.user)
          } else {
            // If no authenticated user, use mock user for basic content
            try {
              const response = await fetch("/api/mock-users").catch(() => null)
              if (response) {
                const mockUsers = await response.json()
                if (mockUsers && mockUsers.length > 0) {
                  setMockUser(mockUsers[0]) // Use the first mock user
                }
              }
            } catch (error) {
              console.error("Error fetching mock users:", error)
            }
          }
          setAuthChecked(true)
        }
      } catch (err) {
        console.error("Unexpected error during auth check:", err)
        if (mounted) {
          setIsAuthenticated(false)
          setAuthChecked(true)
          setContent(mockContent)
        }
      }
    }

    checkUser()

    return () => {
      mounted = false
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const fetchContent = async () => {
      if (!authChecked) return

      try {
        setLoading(true)

        // Use mock content directly if API call fails
        try {
          // Get subscription tier from authenticated user or mock user or use basic
          const tier = isAuthenticated ? user?.user_metadata?.subscription_tier || "basic" : "basic"
          const response = await fetch(`/api/content?tier=${tier}`).catch(() => null)

          if (response) {
            const contentData = await response.json()
            if (mounted) {
              setContent(contentData)
            }
          } else {
            if (mounted) {
              setContent(mockContent)
            }
          }
        } catch (error) {
          console.error("Error fetching content:", error)
          if (mounted) {
            setContent(mockContent)
          }
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchContent()

    return () => {
      mounted = false
    }
  }, [authChecked, isAuthenticated, user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  // Group content by categories
  const trendingContent = content.filter((item) => item.is_trending)
  const newReleases = content.filter((item) => item.is_new_release)
  const tvShows = content.filter((item) => item.category === "TV Show")
  const movies = content.filter((item) => item.category === "Movie")

  // Find a featured content for the billboard
  const featuredContent = content.find((item) => item.title === "Stranger Things") || trendingContent[0] || content[0]

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      {/* Billboard */}
      {featuredContent && (
        <Billboard
          title={featuredContent.title}
          description={featuredContent.description}
          imageUrl={featuredContent.image_url}
          videoId={featuredContent.video_url?.split("embed/")[1]}
          maturityRating={featuredContent.rating}
          id={featuredContent.id}
        />
      )}

      {/* Sign Up Banner for non-authenticated users */}
      {!isAuthenticated && (
        <section className="relative z-10 bg-gray-900 py-8 border-y border-gray-800">
          <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Get Access to Premium Content</h2>
            <p className="text-lg mb-6">Sign up now to unlock all movies and TV shows in HD and 4K quality.</p>
            <div className="flex justify-center gap-4">
              <Link href="/sign-up">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">Sign Up Now</Button>
              </Link>
              <Link href="/sign-in">
                <Button variant="outline" className="border-gray-600 hover:bg-gray-800">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Content Sliders */}
      <section className="relative z-10 pt-8 pb-12">
        <div className="space-y-0">
          {trendingContent.length > 0 && (
            <ContentSlider title="Trending Now" items={trendingContent} isAuthenticated={isAuthenticated} />
          )}

          {trendingContent.length > 0 && <TopTenRow items={trendingContent} isAuthenticated={isAuthenticated} />}

          {newReleases.length > 0 && (
            <ContentSlider title="New Releases" items={newReleases} isAuthenticated={isAuthenticated} />
          )}

          {tvShows.length > 0 && <ContentSlider title="TV Shows" items={tvShows} isAuthenticated={isAuthenticated} />}

          {movies.length > 0 && <ContentSlider title="Movies" items={movies} isAuthenticated={isAuthenticated} />}

          {/* Genre-based rows */}
          {content.some((item) => item.genre.includes("Drama")) && (
            <ContentSlider
              title="Dramas"
              items={content.filter((item) => item.genre.includes("Drama"))}
              isAuthenticated={isAuthenticated}
            />
          )}

          {content.some((item) => item.genre.includes("Sci-Fi")) && (
            <ContentSlider
              title="Sci-Fi & Fantasy"
              items={content.filter((item) => item.genre.includes("Sci-Fi"))}
              isAuthenticated={isAuthenticated}
            />
          )}

          {content.some((item) => item.genre.includes("Crime")) && (
            <ContentSlider
              title="Crime TV Shows"
              items={content.filter((item) => item.genre.includes("Crime"))}
              isAuthenticated={isAuthenticated}
            />
          )}
        </div>
      </section>

      {/* Premium Content Banner */}
      {!isAuthenticated && content.length > 0 && (
        <section className="py-12 bg-gray-900 border-t border-gray-800">
          <div className="max-w-6xl mx-auto px-4 md:px-8 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Premium Content Awaits</h2>
            <p className="text-lg mb-6">
              Sign up for our premium plans to access exclusive content and advanced features.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-8">
              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Basic</h3>
                <p className="text-3xl font-bold mb-4">
                  $9.99<span className="text-sm font-normal">/month</span>
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 720p video quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Watch on 1 device
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Basic content
                  </li>
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg border-2 border-primary">
                <div className="bg-primary text-white text-sm font-bold py-1 px-3 rounded-full mb-2 inline-block">
                  POPULAR
                </div>
                <h3 className="text-xl font-bold mb-2">Standard</h3>
                <p className="text-3xl font-bold mb-4">
                  $14.99<span className="text-sm font-normal">/month</span>
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 1080p video quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Watch on 2 devices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Standard content
                  </li>
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg">
                <h3 className="text-xl font-bold mb-2">Premium</h3>
                <p className="text-3xl font-bold mb-4">
                  $19.99<span className="text-sm font-normal">/month</span>
                </p>
                <ul className="text-left space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> 4K + HDR quality
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> Watch on 4 devices
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span> All premium content
                  </li>
                </ul>
                <Link href="/sign-up">
                  <Button className="w-full bg-primary hover:bg-primary/90">Get Started</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}

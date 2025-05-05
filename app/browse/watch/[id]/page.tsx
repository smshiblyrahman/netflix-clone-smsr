"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { mockContent, type ContentItem } from "@/lib/supabase/mock-data"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function WatchContent() {
  const params = useParams()
  const router = useRouter()
  const [content, setContent] = useState<ContentItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in watch page:", error)
          if (mounted) {
            setIsAuthenticated(false)
            setAuthChecked(true)
          }
          return
        }

        if (mounted) {
          setIsAuthenticated(!!data.session)
          setAuthChecked(true)
        }
      } catch (err) {
        console.error("Unexpected error checking auth in watch page:", err)
        if (mounted) {
          setIsAuthenticated(false)
          setAuthChecked(true)
        }
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const fetchContent = async () => {
      if (!params.id) return

      try {
        setLoading(true)
        // Find the content item by ID
        const contentItem = mockContent.find((item) => item.id === params.id)
        if (mounted) {
          setContent(contentItem || null)
        }
      } catch (error) {
        console.error("Error fetching content:", error)
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
  }, [params.id])

  if (loading || !authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!content) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Content not found</h1>
        <Button onClick={() => router.push("/browse")}>Back to Browse</Button>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-16">
        {/* Video Player or Sign In Prompt */}
        <div className="w-full aspect-video bg-gray-900 flex items-center justify-center">
          {isAuthenticated ? (
            content.video_url ? (
              <iframe
                src={content.video_url}
                className="w-full h-full"
                title={content.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            ) : (
              <div className="text-center p-8">
                <h2 className="text-2xl font-bold mb-4">{content.title}</h2>
                <p className="text-gray-400 mb-8">This content is currently unavailable for streaming.</p>
                <Button onClick={() => router.push("/browse")} variant="outline">
                  Back to Browse
                </Button>
              </div>
            )
          ) : (
            <div className="text-center p-8 max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold mb-4">Sign In to Watch</h2>
              <p className="text-gray-400 mb-8">
                You need to sign in to watch {content.title}. Create an account or sign in to continue.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/sign-in">
                  <Button className="bg-primary hover:bg-primary/90 w-full sm:w-auto">Sign In</Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" className="border-gray-600 hover:bg-gray-800 w-full sm:w-auto">
                    Sign Up
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="max-w-6xl mx-auto p-8">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-2/3">
              <h1 className="text-3xl font-bold mb-2">{content.title}</h1>
              <div className="flex items-center gap-3 text-sm text-gray-400 mb-4">
                <span>{content.release_year}</span>
                <span>•</span>
                <span>{content.rating}</span>
                <span>•</span>
                <span>{content.duration}</span>
              </div>
              <p className="mb-6">{content.description}</p>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {content.genre.map((genre, index) => (
                    <span key={index} className="bg-gray-800 px-3 py-1 rounded-full text-sm">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="md:w-1/3">
              <div className="bg-gray-900 p-4 rounded-md">
                <h3 className="text-lg font-medium mb-4">More Like This</h3>
                <div className="space-y-4">
                  {mockContent
                    .filter((item) => item.id !== content.id && item.genre.some((g) => content.genre.includes(g)))
                    .slice(0, 3)
                    .map((item) => (
                      <div key={item.id} className="flex gap-3">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.title}
                          className="w-24 h-16 object-cover rounded"
                        />
                        <div>
                          <h4 className="font-medium">{item.title}</h4>
                          <p className="text-xs text-gray-400">
                            {item.rating} • {item.duration}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

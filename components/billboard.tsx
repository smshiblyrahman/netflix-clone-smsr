"use client"

import { useState, useEffect } from "react"
import { Play, Info, VolumeX, Volume2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface BillboardProps {
  title: string
  description: string
  videoId?: string
  imageUrl: string
  logoUrl?: string
  category?: string
  maturityRating?: string
  id: string
}

export function Billboard({
  title,
  description,
  videoId,
  imageUrl,
  logoUrl,
  category = "TV Show",
  maturityRating = "TV-MA",
  id,
}: BillboardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)

  // Use try-catch to handle potential Supabase initialization errors
  let supabase
  try {
    supabase = createClient()
  } catch (error) {
    console.error("Failed to initialize Supabase client in Billboard:", error)
  }

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        setIsLoading(true)

        if (!supabase) {
          if (mounted) {
            setIsAuthenticated(false)
            setIsLoading(false)
          }
          return
        }

        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in billboard:", error)
          if (mounted) setIsAuthenticated(false)
          return
        }

        if (mounted) setIsAuthenticated(!!data.session)
      } catch (err) {
        console.error("Unexpected error checking auth in billboard:", err)
        if (mounted) setIsAuthenticated(false)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkAuth()

    // Simulate video loading after 2 seconds
    const timer = setTimeout(() => {
      if (mounted) setIsVideoPlaying(true)
    }, 2000)

    return () => {
      mounted = false
      clearTimeout(timer)
    }
  }, [supabase])

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  if (isLoading) {
    return (
      <div className="relative h-[80vh] bg-gray-900 animate-pulse">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-[80vh] overflow-hidden">
      {/* Background Image/Video */}
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${imageUrl})` }}>
        {isVideoPlaying && videoId && (
          <div className="absolute inset-0 bg-black/30">
            {/* This would be a real video in a production app */}
            <div className="w-full h-full opacity-80">
              <img src={imageUrl || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/70"></div>
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-center p-8 md:p-16 billboard-animation">
        <div className="max-w-2xl">
          {logoUrl ? (
            <img src={logoUrl || "/placeholder.svg"} alt={title} className="w-2/3 mb-6" />
          ) : (
            <h1 className="text-5xl md:text-7xl font-bold mb-4">{title}</h1>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
            <span className="text-green-500 font-semibold">98% Match</span>
            <span>{new Date().getFullYear()}</span>
            <span className="maturity-rating px-1 text-xs">{maturityRating}</span>
            <span>1 Season</span>
            <span className="border border-gray-600 text-xs px-1">HD</span>
          </div>

          <p className="text-lg mb-6 line-clamp-3 md:line-clamp-4">{description}</p>

          <div className="flex gap-4">
            {isAuthenticated ? (
              <>
                <Link href={`/browse/watch/${id}`}>
                  <Button className="bg-white text-black px-6 py-2 rounded flex items-center gap-2 hover:bg-white/90">
                    <Play className="h-5 w-5" /> Play
                  </Button>
                </Link>
                <Button className="bg-gray-500/50 text-white px-6 py-2 rounded flex items-center gap-2 hover:bg-gray-500/70">
                  <Info className="h-5 w-5" /> More Info
                </Button>
              </>
            ) : (
              <Link href="/sign-in">
                <Button className="bg-primary hover:bg-primary/90 text-white px-6 py-2">Sign In to Watch</Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Volume Control */}
      {isVideoPlaying && (
        <button
          onClick={toggleMute}
          className="absolute bottom-[20%] right-8 z-20 bg-gray-800/60 hover:bg-gray-700/60 rounded-full p-2 transition-colors duration-300"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
        </button>
      )}

      {/* Maturity Rating */}
      <div className="absolute bottom-8 right-8 z-20 flex items-center gap-2 text-sm">
        <span className="maturity-rating px-2 py-1 border border-gray-600">{maturityRating}</span>
      </div>
    </div>
  )
}

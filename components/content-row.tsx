"use client"

import Link from "next/link"
import type { ContentItem } from "@/lib/supabase/mock-data"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import { Play, Info } from "lucide-react"

interface ContentRowProps {
  title: string
  items: ContentItem[]
}

export function ContentRow({ title, items }: ContentRowProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in content row:", error)
          if (mounted) setIsAuthenticated(false)
          return
        }

        if (mounted) setIsAuthenticated(!!data.session)
      } catch (err) {
        console.error("Unexpected error checking auth in content row:", err)
        if (mounted) setIsAuthenticated(false)
      } finally {
        if (mounted) setIsLoading(false)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [supabase])

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="rounded-md bg-gray-800 animate-pulse h-40"></div>
            ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">{title}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {items.map((item) => (
          <div key={item.id} className="block">
            <div className="relative group overflow-hidden rounded-md">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.title}
                className="w-full aspect-[2/3] object-cover transition-transform duration-300 group-hover:scale-105 group-hover:opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent opacity-80"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <h3 className="text-sm font-medium truncate">{item.title}</h3>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span>{item.release_year}</span>
                  <span className="mx-1">•</span>
                  <span>{item.rating}</span>
                </div>
              </div>
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-2">
                <div className="flex gap-2 mb-2">
                  {isAuthenticated ? (
                    <Link
                      href={`/browse/watch/${item.id}`}
                      className="bg-white text-black rounded-full p-2 hover:bg-white/90"
                    >
                      <Play className="h-6 w-6" />
                    </Link>
                  ) : (
                    <Link href="/sign-in" className="bg-primary text-white rounded-full p-2 hover:bg-primary/90">
                      <Play className="h-6 w-6" />
                    </Link>
                  )}
                  <button className="bg-gray-700 text-white rounded-full p-2 hover:bg-gray-600">
                    <Info className="h-6 w-6" />
                  </button>
                </div>
                <span className="text-white text-center font-medium">{item.title}</span>
                <span className="text-white/80 text-xs text-center mt-1">
                  {item.rating} • {item.duration}
                </span>
                <div className="flex flex-wrap gap-1 mt-2 justify-center">
                  {item.genre.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="text-xs bg-gray-800 px-2 py-1 rounded-full">
                      {genre}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

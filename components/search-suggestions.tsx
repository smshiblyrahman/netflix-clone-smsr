"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useDebounce } from "@/hooks/use-debounce"
import type { ContentItem } from "@/lib/supabase/mock-data"
import { createClient } from "@/lib/supabase/client"

interface SearchSuggestionsProps {
  query: string
  onSelect: () => void
}

export function SearchSuggestions({ query, onSelect }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in search suggestions:", error)
          if (mounted) setIsAuthenticated(false)
          return
        }

        if (mounted) setIsAuthenticated(!!data.session)
      } catch (err) {
        console.error("Unexpected error checking auth in search suggestions:", err)
        if (mounted) setIsAuthenticated(false)
      }
    }

    checkAuth()

    return () => {
      mounted = false
    }
  }, [supabase])

  useEffect(() => {
    let mounted = true

    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 2) {
        setSuggestions([])
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        const data = await response.json()
        if (mounted) {
          setSuggestions(data.slice(0, 5)) // Limit to 5 suggestions
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchSuggestions()

    return () => {
      mounted = false
    }
  }, [debouncedQuery])

  if (suggestions.length === 0 && !loading) {
    return null
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-black/95 border border-gray-700 rounded-md shadow-lg z-50 max-h-80 overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center text-gray-400">Loading...</div>
      ) : (
        <ul>
          {suggestions.map((item) => (
            <li key={item.id}>
              {isAuthenticated ? (
                <Link
                  href={`/browse/watch/${item.id}`}
                  className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
                  onClick={onSelect}
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.category} • {item.release_year}
                    </p>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/sign-in"
                  className="flex items-center gap-3 p-3 hover:bg-gray-800 transition-colors"
                  onClick={onSelect}
                >
                  <img
                    src={item.image_url || "/placeholder.svg"}
                    alt={item.title}
                    className="w-12 h-8 object-cover rounded"
                  />
                  <div>
                    <p className="font-medium">{item.title}</p>
                    <p className="text-xs text-gray-400">
                      {item.category} • {item.release_year}
                    </p>
                    <p className="text-xs text-primary">Sign in to watch</p>
                  </div>
                </Link>
              )}
            </li>
          ))}
          {suggestions.length > 0 && (
            <li className="p-2 border-t border-gray-700">
              <Link
                href={`/browse/search?q=${encodeURIComponent(query)}`}
                className="block text-center text-sm text-primary hover:underline p-1"
                onClick={onSelect}
              >
                See all results for "{query}"
              </Link>
            </li>
          )}
        </ul>
      )}
    </div>
  )
}

"use client"

import type React from "react"

import { Search } from "lucide-react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useRef, useState, useEffect } from "react"
import { SearchSuggestions } from "@/components/search-suggestions"
import { createClient } from "@/lib/supabase/client"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in search bar:", error)
          if (mounted) setIsAuthenticated(false)
          return
        }

        if (mounted) setIsAuthenticated(!!data.session)
      } catch (err) {
        console.error("Unexpected error checking auth in search bar:", err)
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Perform search logic here
    setIsOpen(false)
    setQuery("")
  }

  return (
    <div className="relative">
      {isOpen ? (
        <form onSubmit={handleSearch} className="flex items-center">
          <div className="relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Titles, people, genres"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-64 bg-black/90 border-gray-700 text-white pl-10 pr-10 py-1 h-9 focus-visible:ring-primary"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}

            {/* Add search suggestions */}
            {query.length >= 2 && (
              <SearchSuggestions
                query={query}
                onSelect={() => {
                  setIsOpen(false)
                  setQuery("")
                }}
              />
            )}
          </div>
          <button type="button" onClick={() => setIsOpen(false)} className="ml-2 text-gray-400 hover:text-white">
            Cancel
          </button>
        </form>
      ) : (
        <button onClick={() => setIsOpen(true)} className="text-white hover:text-gray-300" aria-label="Search">
          <Search className="h-5 w-5" />
        </button>
      )}
    </div>
  )
}

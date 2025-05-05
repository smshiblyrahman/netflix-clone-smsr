"use client"

import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { ContentRow } from "@/components/content-row"
import { SearchFilters } from "@/components/search-filters"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface ContentItem {
  id: string
  title: string
  category: string
  genre: string[]
  release_year: number
  image_url: string
}

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const query = searchParams.get("q") || ""
  const [searchTerm, setSearchTerm] = useState(query)
  const [results, setResults] = useState<ContentItem[]>([])
  const [loading, setLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authChecked, setAuthChecked] = useState(false)
  const supabase = createClient()

  const [filters, setFilters] = useState({
    category: "",
    genre: "",
    year: "",
  })

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in search page:", error)
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
        console.error("Unexpected error checking auth in search page:", err)
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

  const handleFilterChange = (type: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [type]: value,
    }))
  }

  useEffect(() => {
    setSearchTerm(query)
  }, [query])

  useEffect(() => {
    let mounted = true

    const fetchData = async () => {
      if (!searchTerm || !authChecked) {
        return
      }

      setLoading(true)
      try {
        const response = await fetch(`/api/search?q=${searchTerm}`)
        if (response.ok) {
          const data = await response.json()
          if (mounted) {
            setResults(data)
          }
        } else {
          console.error("Failed to fetch search results")
          if (mounted) {
            setResults([])
          }
        }
      } catch (error) {
        console.error("Error during search:", error)
        if (mounted) {
          setResults([])
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      mounted = false
    }
  }, [searchTerm, authChecked])

  const handleSearch = () => {
    if (searchTerm) {
      router.push(`/browse/search?q=${searchTerm}`)
    }
  }

  // Apply filters to results
  const filteredResults = results.filter((item) => {
    // Apply category filter
    if (filters.category && item.category !== filters.category) {
      return false
    }

    // Apply genre filter
    if (filters.genre && !item.genre.includes(filters.genre)) {
      return false
    }

    // Apply year filter
    if (filters.year) {
      if (filters.year === "older" && item.release_year >= 2018) {
        return false
      } else if (filters.year !== "older" && item.release_year.toString() !== filters.year) {
        return false
      }
    }

    return true
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-4">
        <Input
          type="text"
          placeholder="Search for movies or TV shows..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch()
            }
          }}
        />
        <button onClick={handleSearch} className="bg-primary text-white px-4 py-2 rounded ml-2">
          Search
        </button>
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-6">{query ? `Search results for "${query}"` : "Search"}</h1>

      {/* Sign In Banner for non-authenticated users */}
      {!isAuthenticated && (
        <div className="bg-gray-900 p-6 rounded-md mb-8">
          <h2 className="text-xl font-bold mb-2">Sign In to Access All Content</h2>
          <p className="text-gray-400 mb-4">
            Create an account or sign in to access premium content and personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
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

      {/* Add filters */}
      {results.length > 0 && (
        <SearchFilters
          onFilterChange={handleFilterChange}
          activeFilters={filters}
          availableGenres={Array.from(new Set(results.flatMap((item) => item.genre)))}
        />
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : filteredResults.length > 0 ? (
        <div className="space-y-8">
          {/* Group results by category */}
          {filteredResults.some((item) => item.category === "TV Show") && (
            <ContentRow title="TV Shows" items={filteredResults.filter((item) => item.category === "TV Show")} />
          )}

          {filteredResults.some((item) => item.category === "Movie") && (
            <ContentRow title="Movies" items={filteredResults.filter((item) => item.category === "Movie")} />
          )}

          {/* Group by genre if there are enough results */}
          {filteredResults.length > 6 &&
            Array.from(new Set(filteredResults.flatMap((item) => item.genre)))
              .slice(0, 3)
              .map((genre) => {
                const genreResults = filteredResults.filter((item) => item.genre.includes(genre))
                if (genreResults.length > 0) {
                  return <ContentRow key={genre} title={genre} items={genreResults} />
                }
                return null
              })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-xl text-gray-400 mb-4">
            {query
              ? filters.category || filters.genre || filters.year
                ? "No results match your filters. Try adjusting your search criteria."
                : `No results found for "${query}". Try a different search term.`
              : "Enter a search term to find movies and TV shows."}
          </p>
          <p className="text-gray-500">Try searching for titles, genres, or actors</p>
        </div>
      )}
    </div>
  )
}

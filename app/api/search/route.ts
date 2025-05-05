import { NextResponse } from "next/server"
import { mockContent } from "@/lib/supabase/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q") || ""
  const tier = searchParams.get("tier") || "basic"

  try {
    if (!query) {
      return NextResponse.json([])
    }

    // Filter content based on search query and subscription tier
    const searchResults = mockContent.filter((item) => {
      // Check if content is accessible based on subscription tier
      const tierAccessible =
        tier === "premium" ||
        (tier === "standard" && (item.subscription_tier === "standard" || item.subscription_tier === "basic")) ||
        (tier === "basic" && item.subscription_tier === "basic")

      if (!tierAccessible) {
        return false
      }

      // Search in title, description, and genres
      const matchesTitle = item.title.toLowerCase().includes(query.toLowerCase())
      const matchesDescription = item.description.toLowerCase().includes(query.toLowerCase())
      const matchesGenre = item.genre.some((g) => g.toLowerCase().includes(query.toLowerCase()))

      return matchesTitle || matchesDescription || matchesGenre
    })

    return NextResponse.json(searchResults)
  } catch (error) {
    return NextResponse.json({ error: "Failed to search content" }, { status: 500 })
  }
}

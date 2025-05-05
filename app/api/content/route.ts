import { NextResponse } from "next/server"
import { mockContent } from "@/lib/supabase/mock-data"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tier = searchParams.get("tier") || "basic"

  try {
    // Filter content based on subscription tier
    const filteredContent = mockContent.filter((item) => {
      if (tier === "premium") {
        // Premium users can access all content
        return true
      } else if (tier === "standard") {
        // Standard users can access standard and basic content
        return item.subscription_tier === "standard" || item.subscription_tier === "basic"
      } else {
        // Basic users can only access basic content
        return item.subscription_tier === "basic"
      }
    })

    return NextResponse.json(filteredContent)
  } catch (error) {
    console.error("Failed to fetch content:", error)
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 })
  }
}

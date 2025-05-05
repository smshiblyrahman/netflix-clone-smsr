import { NextResponse } from "next/server"
import { mockUsers } from "@/lib/supabase/mock-data"

export async function GET() {
  try {
    return NextResponse.json(mockUsers)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mock users" }, { status: 500 })
  }
}

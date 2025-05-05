"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { createClient } from "@/lib/supabase/client"
import type { MockUser } from "@/lib/supabase/mock-data"

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [mockUser, setMockUser] = useState<MockUser | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        // If no authenticated user, use mock user
        try {
          const response = await fetch("/api/mock-users")
          const mockUsers = await response.json()
          if (mockUsers && mockUsers.length > 0) {
            setMockUser(mockUsers[0]) // Use the first mock user
          }
        } catch (error) {
          console.error("Error fetching mock users:", error)
        }
      } else {
        setUser(session.user)
      }

      setLoading(false)
    }

    checkUser()
  }, [router, supabase])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  const displayUser = user || mockUser

  return (
    <main className="min-h-screen bg-black">
      <Navbar />

      <div className="pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Account</h1>

          <div className="space-y-8">
            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-700">
                    <img
                      src={displayUser?.avatar_url || "/placeholder.svg?height=100&width=100"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-medium">{displayUser?.full_name || "User"}</h3>
                    <p className="text-gray-400">{displayUser?.email || "user@example.com"}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">
                  Edit Profile
                </Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your subscription details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gray-800 p-4 rounded-md">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium capitalize">{displayUser?.subscription_tier || "Basic"} Plan</h3>
                      <p className="text-sm text-gray-400">
                        Status: <span className="capitalize">{displayUser?.subscription_status || "Active"}</span>
                      </p>
                    </div>
                    <div>
                      <span className="text-lg font-bold">
                        {displayUser?.subscription_tier === "premium"
                          ? "$19.99"
                          : displayUser?.subscription_tier === "standard"
                            ? "$14.99"
                            : "$9.99"}
                      </span>
                      <span className="text-gray-400">/month</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-medium">Plan Features:</h4>
                  <ul className="space-y-1 text-sm">
                    {displayUser?.subscription_tier === "premium" ? (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> 4K + HDR video quality
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Watch on 4 devices at the same time
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Access to all content
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Download on 6 devices
                        </li>
                      </>
                    ) : displayUser?.subscription_tier === "standard" ? (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> 1080p video quality
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Watch on 2 devices at the same time
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Access to most content
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Download on 2 devices
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> 720p video quality
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Watch on 1 device at a time
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Access to basic content
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-500">✓</span> Download on 1 device
                        </li>
                      </>
                    )}
                  </ul>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" className="text-gray-400">
                  Cancel Subscription
                </Button>
                <Button className="bg-primary hover:bg-primary/90">Upgrade Plan</Button>
              </CardFooter>
            </Card>

            <Card className="bg-gray-900 border-gray-800">
              <CardHeader>
                <CardTitle>Billing Information</CardTitle>
                <CardDescription>Manage your payment methods</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-800 p-4 rounded-md flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-700 p-2 rounded">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-gray-300"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <line x1="2" x2="22" y1="10" y2="10" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Visa ending in 1234</p>
                      <p className="text-sm text-gray-400">Expires 12/2025</p>
                    </div>
                  </div>
                  <span className="text-sm bg-green-900/30 text-green-400 px-2 py-1 rounded">Default</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="ml-auto">
                  Add Payment Method
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

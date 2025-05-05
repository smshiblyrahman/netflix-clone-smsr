"use client"

import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { NetflixLogo } from "@/components/ui/netflix-logo"
import { Button } from "@/components/ui/button"

export default function ConfirmationPage() {
  const searchParams = useSearchParams()
  const email = searchParams.get("email") || ""

  return (
    <div className="min-h-screen flex flex-col">
      <header className="p-4">
        <NetflixLogo />
      </header>

      <main className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-black/80 p-8 rounded-md text-center">
          <h1 className="text-3xl font-bold mb-6">Check Your Email</h1>

          <div className="mb-6">
            <p className="text-lg mb-4">We've sent a confirmation email to:</p>
            <p className="text-xl font-bold mb-6">{email}</p>
            <p className="text-gray-400">Please check your inbox and click on the link to verify your account.</p>
          </div>

          <div className="space-y-4">
            <Link href="/sign-in">
              <Button className="w-full bg-primary hover:bg-primary/90">Go to Sign In</Button>
            </Link>

            <p className="text-sm text-gray-400">
              Didn't receive an email? Check your spam folder or{" "}
              <Link href="/sign-up" className="text-white hover:underline">
                try again
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}

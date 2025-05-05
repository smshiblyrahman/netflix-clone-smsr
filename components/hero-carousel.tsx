"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronLeft, ChevronRight, Play, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"

interface HeroSlide {
  id: string
  title: string
  description: string
  image: string
  videoId?: string
  logo?: string
  category: string
  rating: string
  year: number
}

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const supabase = createClient()

  const heroSlides: HeroSlide[] = [
    {
      id: "1",
      title: "Stranger Things",
      description:
        "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
      image: "/images/stranger-things.png",
      videoId: "b9EkMc79ZSU",
      category: "TV Show",
      rating: "TV-14",
      year: 2016,
    },
    {
      id: "3",
      title: "Dark",
      description:
        "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
      image: "/images/dark.png",
      videoId: "rrwycJ08PSA",
      category: "TV Show",
      rating: "TV-MA",
      year: 2017,
    },
    {
      id: "5",
      title: "Breaking Bad",
      description:
        "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
      image: "/images/breaking-bad.png",
      videoId: "HhesaQXLuRY",
      category: "TV Show",
      rating: "TV-MA",
      year: 2008,
    },
    {
      id: "10",
      title: "Money Heist",
      description:
        "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
      image: "/images/money-heist.png",
      videoId: "_InqQJRqGW4",
      category: "TV Show",
      rating: "TV-MA",
      year: 2017,
    },
    {
      id: "8",
      title: "The Queen's Gambit",
      description:
        "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
      image: "/images/queens-gambit.png",
      videoId: "CDrieqwSdgI",
      category: "TV Show",
      rating: "TV-MA",
      year: 2020,
    },
  ]

  useEffect(() => {
    let mounted = true

    const checkAuth = async () => {
      try {
        setIsLoading(true)
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error checking auth in hero carousel:", error)
          if (mounted) setIsAuthenticated(false)
          return
        }

        if (mounted) setIsAuthenticated(!!data.session)
      } catch (err) {
        console.error("Unexpected error checking auth in hero carousel:", err)
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

  useEffect(() => {
    // Auto-advance slides
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
    }, 8000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [heroSlides.length])

  const nextSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentSlide((prev) => (prev === heroSlides.length - 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentSlide((prev) => (prev === 0 ? heroSlides.length - 1 : prev - 1))
  }

  const goToSlide = (index: number) => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    setCurrentSlide(index)
  }

  // Touch handlers for mobile swiping
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left
      nextSlide()
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      prevSlide()
    }
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
    <div
      className="relative h-[80vh] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides */}
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${slide.image})` }}>
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/0 to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center p-8 md:p-16">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm text-gray-300 mb-2">
                  <span>{slide.category}</span>
                  <span>•</span>
                  <span>{slide.rating}</span>
                  <span>•</span>
                  <span>{slide.year}</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-bold mb-4">{slide.title}</h1>
                <p className="text-lg mb-6 line-clamp-3 md:line-clamp-4">{slide.description}</p>
                <div className="flex gap-4">
                  {isAuthenticated ? (
                    <>
                      <Link href={`/browse/watch/${slide.id}`}>
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
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-300"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-8 w-8" />
      </button>
      <button
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black/30 hover:bg-black/50 rounded-full p-2 transition-colors duration-300"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="h-8 w-8" />
      </button>

      {/* Indicator Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  )
}

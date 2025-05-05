"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Info, Plus } from "lucide-react"
import Link from "next/link"
import type { ContentItem } from "@/lib/supabase/mock-data"

interface TopTenRowProps {
  items: ContentItem[]
  isAuthenticated: boolean
}

export function TopTenRow({ items, isAuthenticated }: TopTenRowProps) {
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)
  const sliderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Check if we need to show the right arrow initially
    if (sliderRef.current) {
      setShowRightArrow(sliderRef.current.scrollWidth > sliderRef.current.clientWidth)
    }
  }, [items])

  const handleScroll = () => {
    if (sliderRef.current) {
      const position = sliderRef.current.scrollLeft
      setShowLeftArrow(position > 10) // Show left arrow if scrolled more than 10px
      setShowRightArrow(
        position < sliderRef.current.scrollWidth - sliderRef.current.clientWidth - 10, // 10px buffer
      )
    }
  }

  const scrollLeft = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth
      sliderRef.current.scrollBy({
        left: -width * 0.75,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    if (sliderRef.current) {
      const width = sliderRef.current.clientWidth
      sliderRef.current.scrollBy({
        left: width * 0.75,
        behavior: "smooth",
      })
    }
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
      scrollRight()
    }

    if (touchStart - touchEnd < -100) {
      // Swipe right
      scrollLeft()
    }
  }

  // Limit to 10 items
  const topTenItems = items.slice(0, 10)

  return (
    <div className="relative py-6 group">
      <h2 className="text-xl font-bold mb-4 px-4 md:px-8">Top 10 Today</h2>

      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 rounded-r-md p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          onClick={scrollLeft}
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Content Slider */}
      <div
        ref={sliderRef}
        className="flex overflow-x-auto no-scrollbar px-4 md:px-8 space-x-4 pb-4"
        onScroll={handleScroll}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {topTenItems.map((item, index) => (
          <div
            key={item.id}
            className="flex-none w-[200px] md:w-[250px] transition-transform duration-300 hover:scale-105 hover:z-10"
          >
            <div className="relative group/item rounded-md overflow-hidden flex items-end">
              {/* Number Badge */}
              <div className="relative w-[40%] h-full flex-shrink-0">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span
                    className="text-8xl font-bold text-black stroke-white"
                    style={{ WebkitTextStroke: "2px white" }}
                  >
                    {index + 1}
                  </span>
                </div>
              </div>

              {/* Image */}
              <div className="w-[60%] aspect-[2/3]">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <div className="p-4 text-center">
                  <div className="flex justify-center gap-2 mb-2">
                    {isAuthenticated ? (
                      <>
                        <Link
                          href={`/browse/watch/${item.id}`}
                          className="bg-white text-black rounded-full p-1 hover:bg-white/90"
                        >
                          <Play className="h-4 w-4" />
                        </Link>
                        <button className="bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600">
                          <Plus className="h-4 w-4" />
                        </button>
                        <button className="bg-gray-700 text-white rounded-full p-1 hover:bg-gray-600">
                          <Info className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <Link href="/sign-in" className="bg-primary text-white rounded-full p-1 hover:bg-primary/90">
                        <Play className="h-4 w-4" />
                      </Link>
                    )}
                  </div>
                  <h3 className="text-sm font-medium">{item.title}</h3>
                  <div className="flex items-center justify-center text-xs text-gray-400 mt-1">
                    <span>{item.release_year}</span>
                    <span className="mx-1">•</span>
                    <span>{item.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black/70 hover:bg-black/90 rounded-l-md p-2 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
          onClick={scrollRight}
          aria-label="Scroll right"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}
    </div>
  )
}

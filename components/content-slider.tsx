"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { ChevronLeft, ChevronRight, Play, Info, Plus } from "lucide-react"
import Link from "next/link"
import type { ContentItem } from "@/lib/supabase/mock-data"

interface ContentSliderProps {
  title: string
  items: ContentItem[]
  isAuthenticated: boolean
}

export function ContentSlider({ title, items, isAuthenticated }: ContentSliderProps) {
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

  return (
    <div className="relative py-6 group">
      <h2 className="text-xl font-bold mb-4 px-4 md:px-8">{title}</h2>

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
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-none w-[200px] md:w-[250px] transition-transform duration-300 hover:scale-105 hover:z-10"
          >
            <div className="relative group/item rounded-md overflow-hidden">
              <img
                src={item.image_url || "/placeholder.svg"}
                alt={item.title}
                className="w-full aspect-[2/3] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-3 transform translate-y-full group-hover/item:translate-y-0 transition-transform duration-300">
                <div className="flex gap-2 mb-2">
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
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <span>{item.release_year}</span>
                  <span className="mx-1">•</span>
                  <span>{item.rating}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {item.genre.slice(0, 2).map((genre, idx) => (
                    <span key={idx} className="text-xs text-gray-300">
                      {idx > 0 && <span className="mx-1">•</span>}
                      {genre}
                    </span>
                  ))}
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

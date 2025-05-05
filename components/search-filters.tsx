"use client"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface SearchFiltersProps {
  onFilterChange: (type: string, value: string) => void
  activeFilters: {
    category: string
    genre: string
    year: string
  }
  availableGenres: string[]
}

export function SearchFilters({ onFilterChange, activeFilters, availableGenres }: SearchFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
            Type: {activeFilters.category || "All"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
          <DropdownMenuRadioGroup
            value={activeFilters.category}
            onValueChange={(value) => onFilterChange("category", value)}
          >
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="Movie">Movies</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="TV Show">TV Shows</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
            Genre: {activeFilters.genre || "All"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
          <DropdownMenuRadioGroup value={activeFilters.genre} onValueChange={(value) => onFilterChange("genre", value)}>
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            {availableGenres.map((genre) => (
              <DropdownMenuRadioItem key={genre} value={genre}>
                {genre}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="bg-gray-900 border-gray-700 text-white">
            Year: {activeFilters.year || "All"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-gray-900 border-gray-700 text-white">
          <DropdownMenuRadioGroup value={activeFilters.year} onValueChange={(value) => onFilterChange("year", value)}>
            <DropdownMenuRadioItem value="">All</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2023">2023</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2022">2022</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2021">2021</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2020">2020</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="2019">2019</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="older">2018 & older</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

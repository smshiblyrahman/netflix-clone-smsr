// Types for our mock data
export interface MockUser {
  id: number
  email: string
  full_name: string
  avatar_url: string | null
  subscription_status: string
  subscription_tier: string
  created_at: string
}

export interface ContentItem {
  id: string
  title: string
  description: string
  image_url: string
  video_url?: string
  category: string
  genre: string[]
  release_year: number
  rating: string
  duration: string
  is_trending: boolean
  is_new_release: boolean
  subscription_tier: string // 'basic', 'standard', or 'premium'
}

// Mock content data
export const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "Stranger Things",
    description:
      "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    image_url: "/images/stranger-things.png",
    video_url: "https://www.youtube.com/embed/b9EkMc79ZSU",
    category: "TV Show",
    genre: ["Sci-Fi", "Horror", "Drama"],
    release_year: 2016,
    rating: "TV-14",
    duration: "4 Seasons",
    is_trending: true,
    is_new_release: false,
    subscription_tier: "basic",
  },
  {
    id: "2",
    title: "The Crown",
    description:
      "This drama follows the political rivalries and romance of Queen Elizabeth II's reign and the events that shaped the second half of the 20th century.",
    image_url: "/images/the-crown.png",
    video_url: "https://www.youtube.com/embed/JWtnJjn6ng0",
    category: "TV Show",
    genre: ["Drama", "Historical", "Biography"],
    release_year: 2016,
    rating: "TV-MA",
    duration: "5 Seasons",
    is_trending: false,
    is_new_release: true,
    subscription_tier: "standard",
  },
  {
    id: "3",
    title: "Dark",
    description:
      "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    image_url: "/images/dark.png",
    video_url: "https://www.youtube.com/embed/rrwycJ08PSA",
    category: "TV Show",
    genre: ["Sci-Fi", "Thriller", "Mystery"],
    release_year: 2017,
    rating: "TV-MA",
    duration: "3 Seasons",
    is_trending: true,
    is_new_release: false,
    subscription_tier: "standard",
  },
  {
    id: "4",
    title: "1899",
    description:
      "Immigrants on a steamship traveling from London to New York get caught up in a mysterious riddle after finding a second vessel adrift on the open sea.",
    image_url: "/images/1899.png",
    video_url: "https://www.youtube.com/embed/ulOOON_KYHs",
    category: "TV Show",
    genre: ["Mystery", "Drama", "Horror"],
    release_year: 2022,
    rating: "TV-MA",
    duration: "1 Season",
    is_trending: true,
    is_new_release: true,
    subscription_tier: "basic",
  },
  {
    id: "5",
    title: "Breaking Bad",
    description:
      "A high school chemistry teacher diagnosed with inoperable lung cancer turns to manufacturing and selling methamphetamine to secure his family's future.",
    image_url: "/images/breaking-bad.png",
    video_url: "https://www.youtube.com/embed/HhesaQXLuRY",
    category: "TV Show",
    genre: ["Crime", "Drama", "Thriller"],
    release_year: 2008,
    rating: "TV-MA",
    duration: "5 Seasons",
    is_trending: false,
    is_new_release: false,
    subscription_tier: "premium",
  },
  {
    id: "6",
    title: "Don't Look Up",
    description:
      "Two astronomers go on a media tour to warn humankind of a planet-killing comet hurtling toward Earth. The response from a distracted world: Meh.",
    image_url: "/images/dont-look-up.png",
    video_url: "https://www.youtube.com/embed/RbIxYm3mKzI",
    category: "Movie",
    genre: ["Comedy", "Disaster", "Satire"],
    release_year: 2021,
    rating: "R",
    duration: "2h 18m",
    is_trending: true,
    is_new_release: true,
    subscription_tier: "standard",
  },
  {
    id: "7",
    title: "Red Notice",
    description:
      "An FBI profiler pursuing the world's most wanted art thief becomes his reluctant partner in crime to catch an elusive crook who's always one step ahead.",
    image_url: "/images/red-notice.png",
    video_url: "https://www.youtube.com/embed/T6l3mM7AWew",
    category: "Movie",
    genre: ["Action", "Comedy", "Thriller"],
    release_year: 2021,
    rating: "PG-13",
    duration: "1h 58m",
    is_trending: true,
    is_new_release: true,
    subscription_tier: "basic",
  },
  {
    id: "8",
    title: "The Queen's Gambit",
    description:
      "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
    image_url: "/images/queens-gambit.png",
    video_url: "https://www.youtube.com/embed/CDrieqwSdgI",
    category: "TV Show",
    genre: ["Drama", "Historical"],
    release_year: 2020,
    rating: "TV-MA",
    duration: "Limited Series",
    is_trending: false,
    is_new_release: false,
    subscription_tier: "premium",
  },
  {
    id: "9",
    title: "Extraction",
    description:
      "A hardened mercenary's mission becomes a soul-searching race to survive when he's sent into Bangladesh to rescue a drug lord's kidnapped son.",
    image_url: "/images/extraction.png",
    video_url: "https://www.youtube.com/embed/L6P3nI6VnlY",
    category: "Movie",
    genre: ["Action", "Thriller"],
    release_year: 2020,
    rating: "R",
    duration: "1h 56m",
    is_trending: false,
    is_new_release: false,
    subscription_tier: "standard",
  },
  {
    id: "10",
    title: "Money Heist",
    description:
      "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    image_url: "/images/money-heist.png",
    video_url: "https://www.youtube.com/embed/_InqQJRqGW4",
    category: "TV Show",
    genre: ["Crime", "Drama", "Thriller"],
    release_year: 2017,
    rating: "TV-MA",
    duration: "5 Seasons",
    is_trending: true,
    is_new_release: false,
    subscription_tier: "basic",
  },
  {
    id: "11",
    title: "Ozark",
    description:
      "A financial adviser drags his family from Chicago to the Missouri Ozarks, where he must launder $500 million in five years to appease a drug boss.",
    image_url: "/images/ozark.png",
    video_url: "https://www.youtube.com/embed/5hAXVqrljbs",
    category: "TV Show",
    genre: ["Crime", "Drama", "Thriller"],
    release_year: 2017,
    rating: "TV-MA",
    duration: "4 Seasons",
    is_trending: false,
    is_new_release: true,
    subscription_tier: "premium",
  },
  {
    id: "12",
    title: "The Adam Project",
    description:
      "After accidentally crash-landing in 2022, time-traveling fighter pilot Adam Reed teams up with his 12-year-old self on a mission to save the future.",
    image_url: "/images/adam-project.png",
    video_url: "https://www.youtube.com/embed/IE8HIsIrq4o",
    category: "Movie",
    genre: ["Sci-Fi", "Action", "Adventure"],
    release_year: 2022,
    rating: "PG-13",
    duration: "1h 46m",
    is_trending: true,
    is_new_release: true,
    subscription_tier: "standard",
  },
]

// Mock users data
export const mockUsers: MockUser[] = [
  {
    id: 1,
    email: "test1@example.com",
    full_name: "Test User",
    avatar_url: null,
    subscription_status: "active",
    subscription_tier: "basic",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    email: "premium@example.com",
    full_name: "Premium User",
    avatar_url: null,
    subscription_status: "active",
    subscription_tier: "premium",
    created_at: new Date().toISOString(),
  },
]

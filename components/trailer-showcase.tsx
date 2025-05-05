import { Play } from "lucide-react"

interface TrailerShowcaseProps {
  title: string
  subtitle?: string
}

export function TrailerShowcase({ title, subtitle }: TrailerShowcaseProps) {
  // Array of trailer data
  const trailers = [
    {
      title: "Stranger Things",
      image: "/images/stranger-things.png",
      videoId: "b9EkMc79ZSU",
    },
    {
      title: "The Crown",
      image: "/images/the-crown.png",
      videoId: "JWtnJjn6ng0",
    },
    {
      title: "Money Heist",
      image: "/images/money-heist.png",
      videoId: "_InqQJRqGW4",
    },
    {
      title: "Breaking Bad",
      image: "/images/breaking-bad.png",
      videoId: "HhesaQXLuRY",
    },
  ]

  return (
    <div className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          {subtitle && <p className="mt-2 text-xl text-gray-300">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trailers.map((trailer, index) => (
            <div key={index} className="relative group">
              <div className="aspect-video relative overflow-hidden rounded-md shadow-lg">
                <img
                  src={trailer.image || "/placeholder.svg"}
                  alt={trailer.title}
                  className="w-full h-full object-cover group-hover:opacity-70 transition-opacity duration-300"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-red-600 rounded-full p-4 shadow-lg">
                    <Play className="h-8 w-8 text-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <h3 className="text-xl font-bold">{trailer.title}</h3>
                  <p className="text-sm text-gray-300">Watch the trailer</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

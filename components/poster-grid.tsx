interface PosterGridProps {
  title: string
  subtitle?: string
}

export function PosterGrid({ title, subtitle }: PosterGridProps) {
  // Array of poster images to display
  const posters = [
    { src: "/images/stranger-things.png", alt: "Stranger Things" },
    { src: "/images/the-crown.png", alt: "The Crown" },
    { src: "/images/dark.png", alt: "Dark" },
    { src: "/images/breaking-bad.png", alt: "Breaking Bad" },
    { src: "/images/money-heist.png", alt: "Money Heist" },
    { src: "/images/queens-gambit.png", alt: "Queen's Gambit" },
    { src: "/images/ozark.png", alt: "Ozark" },
    { src: "/images/dont-look-up.png", alt: "Don't Look Up" },
    { src: "/images/red-notice.png", alt: "Red Notice" },
    { src: "/images/adam-project.png", alt: "Adam Project" },
    { src: "/images/extraction.png", alt: "Extraction" },
    { src: "/images/1899.png", alt: "1899" },
  ]

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold">{title}</h2>
          {subtitle && <p className="mt-2 text-xl text-gray-300">{subtitle}</p>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {posters.map((poster, index) => (
            <div
              key={index}
              className="aspect-[2/3] relative overflow-hidden rounded-md shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <img src={poster.src || "/placeholder.svg"} alt={poster.alt} className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

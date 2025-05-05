import Link from "next/link"

interface GenreShowcaseProps {
  title: string
}

export function GenreShowcase({ title }: GenreShowcaseProps) {
  const genres = [
    { name: "Action", image: "/images/extraction.png" },
    { name: "Drama", image: "/images/the-crown.png" },
    { name: "Sci-Fi", image: "/images/stranger-things.png" },
    { name: "Crime", image: "/images/breaking-bad.png" },
    { name: "Comedy", image: "/images/dont-look-up.png" },
    { name: "Thriller", image: "/images/dark.png" },
  ]

  return (
    <section className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {genres.map((genre, index) => (
            <Link href="/sign-up" key={index}>
              <div className="relative overflow-hidden rounded-md aspect-video group">
                <img
                  src={genre.image || "/placeholder.svg"}
                  alt={genre.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <h3 className="text-xl font-bold">{genre.name}</h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

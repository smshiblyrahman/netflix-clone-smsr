interface PopularTitlesProps {
  title: string
}

export function PopularTitles({ title }: PopularTitlesProps) {
  // Array of popular titles with images
  const popularTitles = [
    {
      title: "Stranger Things",
      image: "/images/stranger-things.png",
      description:
        "A young boy vanishes, and a small town uncovers a mystery involving secret experiments and supernatural forces.",
    },
    {
      title: "The Crown",
      image: "/images/the-crown.png",
      description: "This drama follows the political rivalries and romance of Queen Elizabeth II's reign.",
    },
    {
      title: "Money Heist",
      image: "/images/money-heist.png",
      description:
        "Eight thieves take hostages in the Royal Mint of Spain as a criminal mastermind manipulates the police.",
    },
  ]

  return (
    <div className="py-16 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">{title}</h2>
        <div className="space-y-12">
          {popularTitles.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col ${index % 2 === 1 ? "md:flex-row-reverse" : "md:flex-row"} gap-8 items-center`}
            >
              <div className="md:w-1/2">
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full rounded-md shadow-lg" />
              </div>
              <div className="md:w-1/2 space-y-4">
                <h3 className="text-2xl md:text-3xl font-bold">{item.title}</h3>
                <p className="text-lg text-gray-300">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

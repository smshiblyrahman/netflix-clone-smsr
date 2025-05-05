import Link from "next/link"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { PosterGrid } from "@/components/poster-grid"
import { TrailerShowcase } from "@/components/trailer-showcase"
import { PopularTitles } from "@/components/popular-titles"
import { GenreShowcase } from "@/components/genre-showcase"
import { HeroCarousel } from "@/components/hero-carousel"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Carousel */}
      <HeroCarousel />

      {/* Trailer Showcase */}
      <TrailerShowcase title="Preview Our Top Shows" subtitle="Watch trailers of our most popular content" />

      {/* Popular Titles Section */}
      <PopularTitles title="Popular on Net-Free" />

      {/* Features Section */}
      <section className="py-16 border-t-8 border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Enjoy on your TV</h2>
              <p className="text-lg md:text-xl">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <img src="/images/the-crown.png" alt="TV" className="relative z-10 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* Poster Grid */}
      <PosterGrid title="A World of Entertainment Awaits" subtitle="Thousands of titles available in our library" />

      <section className="py-16 border-t-8 border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row-reverse items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Download your shows to watch offline</h2>
              <p className="text-lg md:text-xl">Save your favorites easily and always have something to watch.</p>
            </div>
            <div className="md:w-1/2 relative">
              <img src="/images/money-heist.png" alt="Mobile device" className="relative z-10 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-t-8 border-gray-800 bg-black">
        <div className="max-w-6xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:w-1/2 space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold">Watch everywhere</h2>
              <p className="text-lg md:text-xl">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV.
              </p>
            </div>
            <div className="md:w-1/2 relative">
              <img src="/images/breaking-bad.png" alt="Devices" className="relative z-10 rounded-md" />
            </div>
          </div>
        </div>
      </section>

      {/* New Releases Section */}
      <section className="py-16 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">New Releases</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              { title: "Don't Look Up", image: "/images/dont-look-up.png" },
              { title: "Red Notice", image: "/images/red-notice.png" },
              { title: "The Adam Project", image: "/images/adam-project.png" },
              { title: "1899", image: "/images/1899.png" },
            ].map((item, index) => (
              <div key={index} className="relative group overflow-hidden rounded-md shadow-lg netflix-card">
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.title}
                  className="w-full aspect-[2/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-xl font-bold">{item.title}</h3>
                  <p className="text-sm text-gray-300">New Release</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Genre Showcase */}
      <GenreShowcase title="Browse by Genre" />

      {/* FAQ Section */}
      <section className="py-16 border-t-8 border-gray-800 bg-black">
        <div className="max-w-4xl mx-auto px-4 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-8">Frequently Asked Questions</h2>

          <div className="space-y-4 mb-12">
            <div className="bg-gray-800 p-4 text-left">
              <h3 className="text-xl font-medium">What is Net-Free?</h3>
              <p className="mt-2">
                Net-Free is a streaming service that offers a wide variety of award-winning TV shows, movies, anime,
                documentaries, and more on thousands of internet-connected devices.
              </p>
            </div>

            <div className="bg-gray-800 p-4 text-left">
              <h3 className="text-xl font-medium">How much does Net-Free cost?</h3>
              <p className="mt-2">
                Watch Net-Free on your smartphone, tablet, Smart TV, laptop, or streaming device, all for one fixed
                monthly fee. Plans range from $8.99 to $17.99 a month.
              </p>
            </div>

            <div className="bg-gray-800 p-4 text-left">
              <h3 className="text-xl font-medium">Where can I watch?</h3>
              <p className="mt-2">
                Watch anywhere, anytime. Sign in with your Net-Free account to watch instantly on the web at netfree.com
                from your personal computer or on any internet-connected device.
              </p>
            </div>
          </div>

          <p className="text-lg md:text-xl mb-8">Ready to watch? Create an account to start your membership.</p>
          <div className="flex justify-center">
            <Link href="/sign-up">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">Get Started</Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  )
}

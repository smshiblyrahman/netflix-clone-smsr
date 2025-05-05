import Link from "next/link"

export function NetflixLogo({ className = "" }: { className?: string }) {
  return (
    <Link href="/">
      <div className={`text-primary font-bold text-3xl ${className}`}>Net-Free</div>
    </Link>
  )
}

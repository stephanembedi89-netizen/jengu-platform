import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

const sizes = {
  sm: 32,
  md: 42,
  lg: 64,
}

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = sizes[size]

  return (
    <Link href="/" className="flex items-center gap-3 group" aria-label="Jengu.AI — Accueil">
      {/* ── Logo image ──
          Place your file "NEW LOGO.jpg" (or logo.png) inside the /public folder.
          The src below references /public/logo.jpg — rename accordingly.       */}
      <div
        className="relative flex-shrink-0 rounded-full overflow-hidden"
        style={{ width: px, height: px }}
      >
        <Image
          src="/logo.jpg"
          alt="Jengu.AI logo"
          fill
          sizes={`${px}px`}
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          priority
        />
      </div>

      {showText && (
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: size === 'lg' ? '1.75rem' : size === 'md' ? '1.3rem' : '1rem' }}
        >
          <span className="text-white">Jengu</span>
          <span className="gradient-text">.AI</span>
        </span>
      )}
    </Link>
  )
}

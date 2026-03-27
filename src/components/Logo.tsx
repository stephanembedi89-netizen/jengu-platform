import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

/* The JenguAI SVG logo: electric-blue water drop + golden spirit face + sparkles
   Faithfully reproduces the brand identity (water drop, woman profile in gold, particles). */
function JenguSVG({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Drop fill: deep navy → electric blue radial */}
        <radialGradient id="jDrop" cx="42%" cy="28%" r="70%" gradientUnits="objectBoundingBox">
          <stop offset="0%"   stopColor="#1e3a8a" />
          <stop offset="45%"  stopColor="#1e40af" />
          <stop offset="100%" stopColor="#0a0e2a" />
        </radialGradient>
        {/* Outer halo glow */}
        <radialGradient id="jHalo" cx="50%" cy="60%" r="50%">
          <stop offset="0%"   stopColor="#3b82f6" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"   />
        </radialGradient>
        {/* Drop border gradient */}
        <linearGradient id="jStroke" x1="50" y1="3" x2="50" y2="97" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#93c5fd" />
          <stop offset="60%"  stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        {/* Gold gradient for face */}
        <linearGradient id="jGold" x1="45" y1="16" x2="55" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="jBlur" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
        <filter id="jInnerGlow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* ── Outer ambient halo ── */}
      <ellipse cx="50" cy="66" rx="40" ry="34" fill="url(#jHalo)" filter="url(#jBlur)" />

      {/* ── Main water drop (point up) ── */}
      <path
        d="M50 3 C37 17 6 48 6 68 C6 85.4 26.3 97 50 97 C73.7 97 94 85.4 94 68 C94 48 63 17 50 3 Z"
        fill="url(#jDrop)"
        stroke="url(#jStroke)"
        strokeWidth="1.2"
      />

      {/* ── Refraction highlight (left inner curve of the drop) ── */}
      <path d="M28 28 C22 40 19 54 22 64"
        stroke="white" strokeWidth="3.5" strokeLinecap="round" opacity="0.10" />
      <ellipse cx="32" cy="30" rx="7" ry="12" fill="white" opacity="0.07"
        transform="rotate(-18,32,30)" />

      {/* ── GOLDEN FACE PROFILE ──
          Woman profile facing RIGHT (right-side view, nose to the right).
          Three path segments: forehead → nose, nose → chin, hair flows.         */}
      {/* Forehead arch */}
      <path d="M46 18 C50 22 53 27 52 33"
        stroke="url(#jGold)" strokeWidth="2.4" strokeLinecap="round" fill="none" />
      {/* Nose bridge → nose tip → philtrum → lips → chin */}
      <path d="M52 33 C52 38 51 43 56 48 C58 51 57 53 54 55 C57 59 55 63 51 67 C49 70 47 73 47 76"
        stroke="url(#jGold)" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* Hair — primary flowing arc */}
      <path d="M44 16 C54 20 63 34 61 52 C59 62 54 70 49 78"
        stroke="#d97706" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.82" />
      {/* Hair — secondary flow */}
      <path d="M42 14 C55 20 66 42 62 60 C60 68 56 76 51 82"
        stroke="#fbbf24" strokeWidth="1.1" strokeLinecap="round" fill="none" opacity="0.48" />
      {/* Hair — tertiary accent */}
      <path d="M48 14 C60 22 66 40 62 54"
        stroke="#fde68a" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.30" />

      {/* ── Central inner glow (spirit light) ── */}
      <circle cx="36" cy="64" r="13" fill="#1d4ed8" opacity="0.22" />
      <circle cx="36" cy="64" r="7"  fill="#60a5fa" opacity="0.22" filter="url(#jInnerGlow)" />
      <circle cx="36" cy="64" r="3"  fill="#bfdbfe" opacity="0.40" />
      <circle cx="36" cy="64" r="1.4" fill="white"  opacity="0.70" />

      {/* ── Sparkle particles ── */}
      {/* Left outer */}
      <circle cx="14" cy="52" r="1.8" fill="#93c5fd" opacity="0.90" />
      <circle cx="10" cy="72" r="1.2" fill="#bfdbfe" opacity="0.75" />
      <circle cx="18" cy="36" r="1.1" fill="#60a5fa"  opacity="0.70" />
      {/* Right outer */}
      <circle cx="84" cy="44" r="2.2" fill="#93c5fd" opacity="0.88" />
      <circle cx="88" cy="66" r="1.5" fill="#93c5fd" opacity="0.78" />
      <circle cx="80" cy="82" r="1.1" fill="#60a5fa"  opacity="0.62" />
      {/* Top area */}
      <circle cx="64" cy="18" r="1.4" fill="#93c5fd" opacity="0.72" />
      <circle cx="34" cy="90" r="1.0" fill="#60a5fa"  opacity="0.55" />

      {/* ── 4-ray star sparkle (top-right) ── */}
      <g transform="translate(75,26)">
        <circle r="2.2" fill="#93c5fd" opacity="0.92" />
        <line x1="-4.5" y1="0"    x2="4.5" y2="0"    stroke="#93c5fd" strokeWidth="0.8" opacity="0.70" />
        <line x1="0"    y1="-4.5" x2="0"   y2="4.5"  stroke="#93c5fd" strokeWidth="0.8" opacity="0.70" />
        <line x1="-3"   y1="-3"   x2="3"   y2="3"    stroke="#93c5fd" strokeWidth="0.5" opacity="0.38" />
        <line x1="3"    y1="-3"   x2="-3"  y2="3"    stroke="#93c5fd" strokeWidth="0.5" opacity="0.38" />
      </g>
      {/* Small cross sparkle (bottom-left) */}
      <g transform="translate(20,88)">
        <circle r="1.5" fill="#60a5fa" opacity="0.80" />
        <line x1="-3" y1="0" x2="3" y2="0" stroke="#60a5fa" strokeWidth="0.6" opacity="0.55" />
        <line x1="0" y1="-3" x2="0" y2="3" stroke="#60a5fa" strokeWidth="0.6" opacity="0.55" />
      </g>

      {/* ── Water surface reflection waves at bottom ── */}
      <path d="M22 88 Q30 92 38 88 Q46 84 54 88 Q62 92 70 88"
        stroke="#3b82f6" strokeWidth="0.8" fill="none" opacity="0.40" strokeLinecap="round" />
      <path d="M28 93 Q36 97 44 93 Q52 89 60 93"
        stroke="#3b82f6" strokeWidth="0.6" fill="none" opacity="0.22" strokeLinecap="round" />
    </svg>
  )
}

const sizes = { sm: 36, md: 46, lg: 68 }

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = sizes[size]

  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="Jengu.AI — Accueil">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <JenguSVG px={px} />
      </div>

      {showText && (
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: size === 'lg' ? '1.8rem' : size === 'md' ? '1.35rem' : '1.05rem' }}
        >
          <span className="text-white">Jengu</span>
          <span className="gradient-text">AI</span>
        </span>
      )}
    </Link>
  )
}

import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

/*
  SVG logo redesigné pour correspondre fidèlement au logo JenguAI :
  - Goutte d'eau bleu électrique (point vers le haut, bas arrondi)
  - Visage féminin de profil en or (profil droit, nez vers la droite)
  - Cheveux fluides en arcs dorés s'étirant vers la gauche
  - Lueur centrale bleue (l'esprit de l'eau)
  - Particules/étincelles autour de la goutte
*/
function JenguSVG({ px }: { px: number }) {
  return (
    <svg
      width={px}
      height={px}
      viewBox="0 0 100 115"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        {/* Dégradé radial du fond de la goutte : bleu nuit profond */}
        <radialGradient id="gDrop" cx="45%" cy="30%" r="68%">
          <stop offset="0%"   stopColor="#1e3a8a" />
          <stop offset="50%"  stopColor="#1e40af" />
          <stop offset="100%" stopColor="#080e24" />
        </radialGradient>
        {/* Dégradé de la bordure : cyan → bleu électrique */}
        <linearGradient id="gBorder" x1="50" y1="3" x2="50" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#7dd3fc" />
          <stop offset="40%"  stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
        {/* Halo extérieur */}
        <radialGradient id="gHalo" cx="50%" cy="58%" r="50%">
          <stop offset="0%"   stopColor="#0ea5e9" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0"    />
        </radialGradient>
        {/* Dégradé or pour le visage */}
        <linearGradient id="gGold" x1="40" y1="14" x2="62" y2="80" gradientUnits="userSpaceOnUse">
          <stop offset="0%"   stopColor="#fef08a" />
          <stop offset="60%"  stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        {/* Lueur intérieure */}
        <radialGradient id="gInner" cx="38%" cy="62%" r="40%">
          <stop offset="0%"   stopColor="#7dd3fc" stopOpacity="0.9" />
          <stop offset="60%"  stopColor="#3b82f6" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0"   />
        </radialGradient>
        <filter id="fBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
        <filter id="fSoftGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* ── Halo ambiant derrière la goutte ── */}
      <ellipse cx="50" cy="72" rx="46" ry="40" fill="url(#gHalo)" filter="url(#fBlur)" />

      {/* ── Goutte d'eau principale (point en haut) ── */}
      <path
        d="M50 3
           C37 17 6 50 6 73
           C6 92 26 106 50 106
           C74 106 94 92 94 73
           C94 50 63 17 50 3 Z"
        fill="url(#gDrop)"
        stroke="url(#gBorder)"
        strokeWidth="1.4"
      />

      {/* ── Reflet d'eau (côté gauche de la goutte, brillance) ── */}
      <path d="M26 26 C20 38 16 54 18 68"
        stroke="white" strokeWidth="4" strokeLinecap="round" opacity="0.09" />
      <ellipse cx="30" cy="28" rx="6" ry="11"
        fill="white" opacity="0.06" transform="rotate(-20,30,28)" />

      {/* ══════════════════════════════════════════
          CHEVEUX — arcs dorés fluides s'étirant
          vers la gauche, partant du haut du crâne.
          3 arcs de profondeur différente.
          ══════════════════════════════════════════ */}
      {/* Arc principal (le plus visible, au milieu) */}
      <path
        d="M52 14
           C44 18 34 28 28 42
           C22 56 24 70 26 80"
        stroke="url(#gGold)" strokeWidth="2.2" strokeLinecap="round" fill="none"
      />
      {/* Arc extérieur (chevelure ample) */}
      <path
        d="M50 12
           C40 16 26 30 18 50
           C12 66 16 82 20 90"
        stroke="#fbbf24" strokeWidth="1.6" strokeLinecap="round" fill="none" opacity="0.72"
      />
      {/* Arc intérieur (mèche fine) */}
      <path
        d="M54 15
           C48 20 40 32 36 46
           C32 58 34 68 36 76"
        stroke="#fde68a" strokeWidth="1.0" strokeLinecap="round" fill="none" opacity="0.50"
      />
      {/* Mèche fine supplémentaire */}
      <path
        d="M56 17
           C52 24 46 36 44 50
           C42 60 44 70 44 78"
        stroke="#d97706" strokeWidth="0.8" strokeLinecap="round" fill="none" opacity="0.38"
      />

      {/* ══════════════════════════════════════════
          VISAGE — profil gauche (nez vers la DROITE)
          Tracé unique : front → nez → lèvres → menton
          ══════════════════════════════════════════ */}
      <path
        d="M52 16
           C56 20 60 26 59 32
           C58 36 56 39 57 44
           C58 47 64 51 61 56
           C59 59 56 61 57 66
           C58 69 55 73 52 77"
        stroke="url(#gGold)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"
        fill="none" filter="url(#fSoftGlow)"
      />

      {/* ── Lueur intérieure (esprit de l'eau) ── */}
      <ellipse cx="44" cy="70" rx="16" ry="18" fill="url(#gInner)" opacity="0.55" />
      <circle  cx="44" cy="68" r="5"  fill="#bfdbfe" opacity="0.28" />
      <circle  cx="44" cy="68" r="2"  fill="white"   opacity="0.55" />

      {/* ══════════════════════════════════════════
          PARTICULES & ÉTINCELLES
          ══════════════════════════════════════════ */}
      {/* Gauche */}
      <circle cx="12" cy="54" r="2.0" fill="#7dd3fc" opacity="0.92" />
      <circle cx="8"  cy="74" r="1.3" fill="#bae6fd" opacity="0.78" />
      <circle cx="16" cy="36" r="1.2" fill="#38bdf8" opacity="0.68" />
      {/* Droite */}
      <circle cx="86" cy="46" r="2.4" fill="#7dd3fc" opacity="0.90" />
      <circle cx="90" cy="68" r="1.6" fill="#7dd3fc" opacity="0.80" />
      <circle cx="82" cy="84" r="1.1" fill="#38bdf8" opacity="0.62" />
      {/* Haut / bas */}
      <circle cx="66" cy="16" r="1.5" fill="#7dd3fc" opacity="0.75" />
      <circle cx="34" cy="96" r="1.0" fill="#38bdf8" opacity="0.55" />
      <circle cx="72" cy="92" r="1.1" fill="#7dd3fc" opacity="0.50" />

      {/* Étoile à 4 branches (haut-droite) */}
      <g transform="translate(78,24)" filter="url(#fSoftGlow)">
        <circle r="2.4" fill="#7dd3fc" opacity="0.95" />
        <line x1="-5"   y1="0"   x2="5"   y2="0"   stroke="#7dd3fc" strokeWidth="0.9" opacity="0.75" />
        <line x1="0"    y1="-5"  x2="0"   y2="5"   stroke="#7dd3fc" strokeWidth="0.9" opacity="0.75" />
        <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.40" />
        <line x1="3.5"  y1="-3.5" x2="-3.5" y2="3.5" stroke="#7dd3fc" strokeWidth="0.5" opacity="0.40" />
      </g>
      {/* Petite croix (bas-gauche) */}
      <g transform="translate(18,90)">
        <circle r="1.6" fill="#38bdf8" opacity="0.82" />
        <line x1="-3.2" y1="0" x2="3.2" y2="0" stroke="#38bdf8" strokeWidth="0.7" opacity="0.58" />
        <line x1="0" y1="-3.2" x2="0" y2="3.2" stroke="#38bdf8" strokeWidth="0.7" opacity="0.58" />
      </g>

      {/* ── Reflet ondulé à la surface de l'eau (bas) ── */}
      <path d="M20 91 Q30 96 40 91 Q50 86 60 91 Q70 96 78 91"
        stroke="#38bdf8" strokeWidth="0.9" fill="none" opacity="0.38" strokeLinecap="round" />
      <path d="M26 97 Q36 102 46 97 Q56 92 66 97"
        stroke="#3b82f6" strokeWidth="0.6" fill="none" opacity="0.22" strokeLinecap="round" />
    </svg>
  )
}

const sizes = { sm: 38, md: 48, lg: 72 }

export default function Logo({ size = 'md', showText = true }: LogoProps) {
  const px = sizes[size]

  return (
    <Link href="/" className="flex items-center gap-2.5 group" aria-label="JenguAI — Accueil">
      <div className="flex-shrink-0 transition-transform duration-300 group-hover:scale-105 drop-shadow-lg">
        <JenguSVG px={px} />
      </div>

      {showText && (
        <span
          className="font-bold tracking-tight leading-none"
          style={{ fontSize: size === 'lg' ? '1.85rem' : size === 'md' ? '1.35rem' : '1.05rem' }}
        >
          <span className="text-white">Jengu</span>
          <span
            style={{
              background: 'linear-gradient(135deg,#38bdf8,#3b82f6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >AI</span>
        </span>
      )}
    </Link>
  )
}

import Link from 'next/link'
import Logo from './Logo'

const nav = [
  { label: 'Services',     href: '/services'     },
  { label: 'Tarification', href: '/tarification' },
  { label: 'Contact',      href: '/contact'      },
]

const services = [
  'Conseil en IA',
  'Automatisation',
  'Annotation de données',
  'Formation IA',
]

export default function Footer() {
  return (
    <footer className="border-t border-blue-500/10 bg-[#020617]">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Logo size="sm" />
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Votre partenaire stratégique en Intelligence Artificielle.
              Nous transformons vos données en avantage compétitif.
            </p>
            {/* Social links */}
            <div className="flex gap-3 mt-2">
              {[
                { label: 'LinkedIn', icon: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                { label: 'Twitter/X', icon: 'M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z' },
              ].map(({ label, icon }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-blue-500/20 flex items-center justify-center text-slate-400 hover:text-blue-400 hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Navigation</h3>
            <ul className="flex flex-col gap-3">
              {nav.map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-blue-500/50 group-hover:bg-blue-400 transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm tracking-wider uppercase">Nos Services</h3>
            <ul className="flex flex-col gap-3">
              {services.map(s => (
                <li key={s}>
                  <Link
                    href="/services"
                    className="text-slate-400 hover:text-blue-400 text-sm transition-colors duration-200 flex items-center gap-2 group"
                  >
                    <span className="w-1 h-1 rounded-full bg-cyan-500/50 group-hover:bg-cyan-400 transition-colors" />
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="divider-glow mt-12 mb-6" />

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-slate-500 text-xs">
          <p>© {new Date().getFullYear()} Jengu.AI — Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">Politique de confidentialité</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Mentions légales</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

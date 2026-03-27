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
            {/* Contact rapide */}
            <div className="flex flex-col gap-2 mt-1">
              <a href="tel:+237672705729"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-xs transition-colors group">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 group-hover:text-blue-400">
                  <path d="M3 5a2 2 0 012-2h2.28a1 1 0 01.95.68l1 3a1 1 0 01-.23 1.05L7.5 9.24A11.04 11.04 0 0010.76 12.5l1.51-1.5a1 1 0 011.05-.23l3 1a1 1 0 01.68.95V15a2 2 0 01-2 2A14 14 0 013 5z"/>
                </svg>
                +237 672 705 729
              </a>
              <a href="mailto:contact@jengu.ai"
                className="flex items-center gap-2 text-slate-400 hover:text-blue-400 text-xs transition-colors group">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M2 4h16v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4z"/><path d="M2 4l8 7 8-7"/>
                </svg>
                contact@jengu.ai
              </a>
              <span className="flex items-center gap-2 text-slate-500 text-xs">
                <svg width="13" height="13" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
                  <path d="M10 2C6.686 2 4 4.686 4 8c0 4.5 6 10 6 10s6-5.5 6-10c0-3.314-2.686-6-6-6z"/><circle cx="10" cy="8" r="2"/>
                </svg>
                Douala, Cameroun
              </span>
            </div>
            {/* Social links */}
            <div className="flex gap-3 mt-1">
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

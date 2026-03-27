'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ParticlesCanvas from '@/components/ParticlesCanvas'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

/* ── Icons ── */
const icons = {
  conseil: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/>
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
    </svg>
  ),
  annotation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h1m5 0h1M9 15h6"/>
    </svg>
  ),
  formation: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  ),
}

const pillars = [
  {
    key: 'conseil',
    title: 'Conseil en IA',
    desc: 'Stratégie IA sur mesure, audit de maturité et feuille de route pour maximiser votre ROI.',
    color: '#3b82f6',
    gradient: 'from-blue-500/20 to-blue-500/5',
  },
  {
    key: 'automation',
    title: 'Automatisation',
    desc: 'Workflows intelligents, RPA augmentée et intégration d\'agents IA dans vos processus métier.',
    color: '#06b6d4',
    gradient: 'from-cyan-500/20 to-cyan-500/5',
  },
  {
    key: 'annotation',
    title: 'Annotation de Données',
    desc: 'Données haute qualité pour entraîner vos modèles : image, texte, vidéo et audio.',
    color: '#818cf8',
    gradient: 'from-indigo-500/20 to-indigo-500/5',
  },
  {
    key: 'formation',
    title: 'Formation IA',
    desc: 'Programmes sur mesure pour rendre vos équipes autonomes avec les outils IA modernes.',
    color: '#fbbf24',
    gradient: 'from-amber-500/20 to-amber-500/5',
  },
]

const stats = [
  { value: '50+', label: 'Projets livrés', suffix: '' },
  { value: '98', label: 'Satisfaction client', suffix: '%' },
  { value: '10M+', label: 'Données annotées', suffix: '' },
  { value: '200+', label: 'Professionnels formés', suffix: '' },
]

export default function HomePage() {
  return (
    <>
      {/* ─────────────── HERO ─────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden hero-bg">
        <ParticlesCanvas />

        {/* Decorative glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 blur-[100px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #3b82f6, transparent)' }} />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full opacity-8 blur-[120px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center pt-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{ background: 'rgba(59,130,246,0.12)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}
          >
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Agence de conseil en Intelligence Artificielle
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold leading-tight tracking-tight text-white mb-6"
          >
            L'eau qui{' '}
            <span className="gradient-text">façonne</span>
            <br />votre avenir IA
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Jengu.AI accompagne les entreprises dans leur transformation numérique grâce
            au conseil, à l'automatisation, à l'annotation de données et à la formation IA.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Link href="/contact" className="btn-primary px-8 py-4 text-base inline-flex items-center gap-2">
              Démarrer un projet
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M1 8h14M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link href="/services" className="btn-secondary px-8 py-4 text-base inline-flex items-center gap-2">
              Découvrir nos services
            </Link>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
          >
            <span>Défiler</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1"
            >
              <div className="w-1 h-2 rounded-full bg-blue-500" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─────────────── STATS ─────────────── */}
      <section className="py-20 relative">
        <div className="divider-glow absolute top-0 left-0 right-0" />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <AnimatedSection key={s.label} delay={i * 0.1} className="text-center">
                <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                  {s.value}{s.suffix}
                </div>
                <div className="text-slate-400 text-sm">{s.label}</div>
              </AnimatedSection>
            ))}
          </div>
        </div>
        <div className="divider-glow absolute bottom-0 left-0 right-0" />
      </section>

      {/* ─────────────── PILLARS ─────────────── */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Ce que nous faisons</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Quatre piliers,<br />
            <span className="gradient-text">une vision</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            De la stratégie à l'exécution, nous couvrons tout le spectre de l'Intelligence Artificielle.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p, i) => (
            <AnimatedSection key={p.key} delay={i * 0.1} direction="up">
              <GlassCard glowColor={p.key === 'formation' ? 'amber' : p.key === 'annotation' ? 'cyan' : 'blue'}>
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: `linear-gradient(135deg, ${p.color}22, ${p.color}08)`, border: `1px solid ${p.color}30`, color: p.color }}
                >
                  {icons[p.key as keyof typeof icons]}
                </div>
                <h3 className="text-white font-bold text-lg mb-3">{p.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{p.desc}</p>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium transition-colors duration-200"
                  style={{ color: p.color }}
                >
                  En savoir plus
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </GlassCard>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* ─────────────── WHY JENGU ─────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(59,130,246,0.06) 0%, transparent 70%)' }} />
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Pourquoi Jengu ?</p>
              <h2 className="text-4xl font-bold text-white mb-6 leading-snug">
                Comme l'eau, nous nous adaptons
                <span className="gradient-text"> à chaque défi</span>
              </h2>
              <p className="text-slate-400 leading-relaxed mb-8">
                Le nom Jengu évoque l'esprit de l'eau — fluide, puissant, capable de contourner
                les obstacles et de trouver le chemin optimal. Notre approche de l'IA reflète
                cette philosophie : des solutions qui s'adaptent précisément à votre contexte.
              </p>
              <ul className="flex flex-col gap-4">
                {[
                  'Expertise multi-sectorielle en IA appliquée',
                  'Équipe certifiée et en veille technologique constante',
                  'Solutions sur mesure, jamais de template générique',
                  'Accompagnement de bout en bout, du projet au déploiement',
                ].map(item => (
                  <li key={item} className="flex items-start gap-3 text-slate-300 text-sm">
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/40 flex items-center justify-center mt-0.5">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5l2 2 4-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="relative">
                {/* Abstract visual — animated rings */}
                <div className="aspect-square max-w-sm mx-auto relative flex items-center justify-center">
                  {[0,1,2,3].map(i => (
                    <motion.div
                      key={i}
                      className="absolute rounded-full border"
                      style={{
                        width: `${40 + i * 18}%`,
                        height: `${40 + i * 18}%`,
                        borderColor: `rgba(59,130,246,${0.5 - i * 0.1})`,
                      }}
                      animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                      transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
                    />
                  ))}
                  <div className="relative z-10 glass w-28 h-28 rounded-full flex items-center justify-center"
                    style={{ boxShadow: '0 0 40px rgba(59,130,246,0.3)' }}>
                    <svg viewBox="0 0 40 40" fill="none" className="w-12 h-12">
                      <path d="M20 3C20 3 8 15 8 23C8 29.627 13.373 35 20 35C26.627 35 32 29.627 32 23C32 15 20 3 20 3Z"
                        fill="url(#heroGrad)"/>
                      <path d="M20 11C20 11 24 16 25 20C25.5 22 24.5 24.5 22.5 25.5C21 26.3 19 26 18 25C16.5 23.5 16.5 21 17.5 19.5"
                        stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round"/>
                      <defs>
                        <linearGradient id="heroGrad" x1="20" y1="3" x2="20" y2="35" gradientUnits="userSpaceOnUse">
                          <stop stopColor="#06b6d4"/>
                          <stop offset="1" stopColor="#3b82f6"/>
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ─────────────── CTA BANNER ─────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <AnimatedSection>
          <div
            className="relative rounded-3xl p-12 md:p-16 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(59,130,246,0.15) 0%, rgba(6,182,212,0.08) 50%, rgba(59,130,246,0.12) 100%)',
              border: '1px solid rgba(59,130,246,0.25)',
            }}
          >
            {/* Background decoration */}
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full opacity-20 blur-3xl pointer-events-none"
              style={{ background: '#3b82f6' }} />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full opacity-15 blur-3xl pointer-events-none"
              style={{ background: '#06b6d4' }} />

            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5">
                Prêt à transformer votre <span className="gradient-text-amber">entreprise ?</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Discutons de votre projet. Un premier échange est gratuit et sans engagement.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/contact" className="btn-primary px-8 py-4 text-base inline-flex items-center gap-2">
                  Prendre contact
                </Link>
                <Link href="/tarification" className="btn-secondary px-8 py-4 text-base">
                  Voir les tarifs
                </Link>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </section>
    </>
  )
}

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

/* ──────────────────────────────────────
   ANNOTATION CALCULATOR DATA
────────────────────────────────────── */
type AnnotationType = {
  key: string
  label: string
  basePrice: number
  unit: string
}

const annotationTypes: AnnotationType[] = [
  { key: 'classification',  label: 'Classification d\'images',    basePrice: 0.05,  unit: 'image' },
  { key: 'bbox',            label: 'Bounding Box (détection)',    basePrice: 0.12,  unit: 'image' },
  { key: 'segmentation',    label: 'Segmentation sémantique',     basePrice: 0.28,  unit: 'image' },
  { key: 'nlp',             label: 'Annotation NLP / Texte',      basePrice: 0.08,  unit: 'document' },
  { key: 'ner',             label: 'NER (entités nommées)',        basePrice: 0.10,  unit: 'document' },
  { key: 'audio',           label: 'Transcription Audio',         basePrice: 0.18,  unit: 'minute' },
  { key: 'video',           label: 'Annotation Vidéo',            basePrice: 0.55,  unit: 'frame' },
]

const getDiscount = (volume: number): number => {
  if (volume >= 500_000) return 0.40
  if (volume >= 100_000) return 0.30
  if (volume >= 50_000)  return 0.20
  if (volume >= 10_000)  return 0.10
  return 0
}

/* ──────────────────────────────────────
   FIXED PLANS
────────────────────────────────────── */
type ServiceTab = 'annotation' | 'conseil' | 'automatisation' | 'formation'

const fixedPlans: Record<Exclude<ServiceTab, 'annotation'>, { plans: { name: string; price: number | null; period: string; features: string[]; cta: string; highlight?: boolean }[] }> = {
  conseil: {
    plans: [
      {
        name: 'Starter',
        price: 2500,
        period: '/mois',
        features: [
          'Audit IA initial (2 jours)',
          'Identification de 3 cas d\'usage',
          'Feuille de route 6 mois',
          '4h de conseil mensuel',
          'Rapport mensuel de suivi',
        ],
        cta: 'Commencer',
      },
      {
        name: 'Pro',
        price: 5000,
        period: '/mois',
        highlight: true,
        features: [
          'Audit IA complet (5 jours)',
          'Cas d\'usage illimités',
          'Feuille de route 18 mois',
          '12h de conseil mensuel',
          'Business case + ROI',
          'Accès équipe dédiée',
        ],
        cta: 'Choisir Pro',
      },
      {
        name: 'Enterprise',
        price: null,
        period: '',
        features: [
          'Accompagnement sur mesure',
          'Équipe intégrée on-site',
          'Conseil illimité',
          'SLA garanti',
          'Rapport board mensuel',
          'Support 24/7',
        ],
        cta: 'Nous contacter',
      },
    ],
  },
  automatisation: {
    plans: [
      {
        name: 'Starter',
        price: 1500,
        period: '/mois',
        features: [
          '1 workflow automatisé',
          'Intégration 2 outils',
          'Tableau de bord basique',
          'Support par email',
          'Mises à jour mensuelles',
        ],
        cta: 'Commencer',
      },
      {
        name: 'Pro',
        price: 3500,
        period: '/mois',
        highlight: true,
        features: [
          'Workflows illimités',
          'Intégration API personnalisée',
          'Agents IA conversationnels',
          'Dashboard avancé',
          'Support prioritaire',
          'Revue bimensuelle',
        ],
        cta: 'Choisir Pro',
      },
      {
        name: 'Enterprise',
        price: null,
        period: '',
        features: [
          'Architecture sur mesure',
          'IA propriétaire intégrée',
          'Déploiement on-premise',
          'SLA 99.9%',
          'Équipe dédiée',
          'Support 24/7',
        ],
        cta: 'Nous contacter',
      },
    ],
  },
  formation: {
    plans: [
      {
        name: 'Sensibilisation',
        price: 800,
        period: '/personne',
        features: [
          '1 journée d\'atelier',
          'Fondamentaux de l\'IA',
          'Cas d\'usage métier',
          'Support de cours PDF',
          'Quiz de validation',
        ],
        cta: 'Réserver',
      },
      {
        name: 'Pratique',
        price: 2400,
        period: '/personne',
        highlight: true,
        features: [
          '3 jours de formation',
          'Prompt Engineering avancé',
          'Ateliers hands-on',
          'Outils IA en entreprise',
          'Certification Jengu.AI',
          'Accès e-learning 6 mois',
        ],
        cta: 'S\'inscrire',
      },
      {
        name: 'Expert',
        price: null,
        period: '',
        features: [
          'Parcours sur mesure',
          'Formation équipe entière',
          'Coaching individuel',
          'Certification officielle',
          'Support post-formation',
          'Tarif groupe disponible',
        ],
        cta: 'Demander un devis',
      },
    ],
  },
}

const tabs: { key: ServiceTab; label: string }[] = [
  { key: 'annotation',     label: 'Annotation' },
  { key: 'conseil',        label: 'Conseil IA' },
  { key: 'automatisation', label: 'Automatisation' },
  { key: 'formation',      label: 'Formation' },
]

/* ──────────────────────────────────────
   COMPONENT
────────────────────────────────────── */
export default function TarificationPage() {
  const [tab, setTab]               = useState<ServiceTab>('annotation')
  const [annotType, setAnnotType]   = useState<string>('classification')
  const [volume, setVolume]         = useState<number>(10000)
  const [complexity, setComplexity] = useState<'standard' | 'high'>('standard')

  const sliderMin  = 1_000
  const sliderMax  = 500_000
  const sliderStep = 1_000

  const selectedType = annotationTypes.find(t => t.key === annotType)!
  const discount     = getDiscount(volume)
  const complexMult  = complexity === 'high' ? 1.5 : 1

  const unitPrice = useMemo(
    () => selectedType.basePrice * complexMult * (1 - discount),
    [selectedType, complexMult, discount]
  )
  const total = useMemo(() => unitPrice * volume, [unitPrice, volume])

  const fmt = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 }).format(n)

  const fmtVol = (n: number) =>
    n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1000 ? `${(n / 1000).toFixed(0)}k` : n.toString()

  return (
    <div className="pt-24">
      {/* ─── Hero ─── */}
      <section className="py-20 text-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(251,191,36,0.10) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-amber-400 text-sm font-semibold tracking-widest uppercase mb-3">Tarification</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Des prix <span className="gradient-text-amber">transparents</span><br />
              et compétitifs
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto">
              Simulez vos coûts en temps réel. Toutes les formules sont en Dollars USD ($).
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Tabs ─── */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <AnimatedSection className="flex flex-wrap justify-center gap-2 mb-14">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="relative px-6 py-3 rounded-full text-sm font-semibold transition-all duration-200"
              style={{
                color: tab === t.key ? '#020617' : '#94a3b8',
                background: tab === t.key ? 'linear-gradient(135deg, #fbbf24, #d97706)' : 'rgba(255,255,255,0.04)',
                border: tab === t.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: tab === t.key ? '0 0 20px rgba(251,191,36,0.35)' : 'none',
              }}
            >
              {t.label}
            </button>
          ))}
        </AnimatedSection>

        <AnimatePresence mode="wait">
          {/* ── ANNOTATION CALCULATOR ── */}
          {tab === 'annotation' && (
            <motion.div
              key="annotation"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                {/* Left — controls */}
                <GlassCard hover={false} className="p-8">
                  <h2 className="text-white font-bold text-xl mb-6">Simulateur d'annotation</h2>

                  {/* Type */}
                  <label className="block text-slate-400 text-sm font-medium mb-3">
                    Type d'annotation
                  </label>
                  <div className="grid grid-cols-1 gap-2 mb-7">
                    {annotationTypes.map(t => (
                      <button
                        key={t.key}
                        onClick={() => setAnnotType(t.key)}
                        className="flex items-center justify-between p-3 rounded-xl text-sm transition-all duration-200"
                        style={{
                          background: annotType === t.key ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.03)',
                          border: annotType === t.key ? '1px solid rgba(59,130,246,0.5)' : '1px solid rgba(255,255,255,0.06)',
                          color: annotType === t.key ? '#93c5fd' : '#94a3b8',
                        }}
                      >
                        <span>{t.label}</span>
                        <span className="text-xs opacity-70">${t.basePrice.toFixed(2)} / {t.unit}</span>
                      </button>
                    ))}
                  </div>

                  {/* Complexity toggle */}
                  <label className="block text-slate-400 text-sm font-medium mb-3">Complexité</label>
                  <div className="flex rounded-xl overflow-hidden border border-white/8 mb-7" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                    {(['standard', 'high'] as const).map(c => (
                      <button
                        key={c}
                        onClick={() => setComplexity(c)}
                        className="flex-1 py-3 text-sm font-medium transition-all duration-200"
                        style={{
                          background: complexity === c ? 'rgba(59,130,246,0.2)' : 'transparent',
                          color: complexity === c ? '#93c5fd' : '#64748b',
                        }}
                      >
                        {c === 'standard' ? 'Standard' : 'Haute complexité (+50%)'}
                      </button>
                    ))}
                  </div>

                  {/* Volume slider */}
                  <div className="mb-2 flex items-center justify-between">
                    <label className="text-slate-400 text-sm font-medium">Volume</label>
                    <span className="text-blue-400 font-bold text-sm">{fmtVol(volume)} {selectedType.unit}s</span>
                  </div>
                  <input
                    type="range"
                    min={sliderMin}
                    max={sliderMax}
                    step={sliderStep}
                    value={volume}
                    onChange={e => setVolume(Number(e.target.value))}
                    className="w-full mb-2"
                    style={{ accentColor: '#3b82f6' }}
                  />
                  <div className="flex justify-between text-slate-600 text-xs">
                    <span>1k</span><span>500k</span>
                  </div>
                </GlassCard>

                {/* Right — result */}
                <div className="flex flex-col gap-4">
                  <GlassCard hover={false} className="p-8" glowColor="amber">
                    <p className="text-slate-400 text-sm mb-1">Estimation totale</p>
                    <div className="text-5xl font-bold gradient-text-amber mb-2">{fmt(total)}</div>
                    <p className="text-slate-500 text-sm">
                      soit <span className="text-white font-semibold">{fmt(unitPrice)}</span> / {selectedType.unit}
                    </p>

                    {discount > 0 && (
                      <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold"
                        style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M6 1l1.3 3.3H11L8.4 6.5l1 3.3L6 8l-3.4 1.8 1-3.3L1 4.3h3.7z" stroke="#fbbf24" strokeWidth="1" fill="#fbbf24"/>
                        </svg>
                        Remise volume de {(discount * 100).toFixed(0)}% appliquée
                      </div>
                    )}
                  </GlassCard>

                  {/* Discount tiers */}
                  <GlassCard hover={false} className="p-6">
                    <p className="text-white font-semibold text-sm mb-4">Paliers de remise volume</p>
                    <div className="flex flex-col gap-2">
                      {[
                        { min: '1k',    max: '9.9k',  disc: '0%',  active: volume < 10_000 },
                        { min: '10k',   max: '49.9k', disc: '-10%', active: volume >= 10_000 && volume < 50_000 },
                        { min: '50k',   max: '99.9k', disc: '-20%', active: volume >= 50_000 && volume < 100_000 },
                        { min: '100k',  max: '499.9k',disc: '-30%', active: volume >= 100_000 && volume < 500_000 },
                        { min: '500k+', max: '',      disc: '-40%', active: volume >= 500_000 },
                      ].map(tier => (
                        <div key={tier.min}
                          className="flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all"
                          style={{
                            background: tier.active ? 'rgba(59,130,246,0.12)' : 'transparent',
                            border: tier.active ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent',
                            color: tier.active ? '#93c5fd' : '#475569',
                          }}>
                          <span>{tier.min}{tier.max ? ` → ${tier.max}` : ''}</span>
                          <span className="font-bold">{tier.disc}</span>
                        </div>
                      ))}
                    </div>
                  </GlassCard>

                  <Link href="/contact" className="btn-primary py-4 text-center text-sm font-bold rounded-2xl">
                    Demander un devis précis →
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── FIXED PLANS ── */}
          {tab !== 'annotation' && (
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.35 }}
            >
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {fixedPlans[tab as keyof typeof fixedPlans].plans.map((plan, i) => (
                  <div key={plan.name} className="relative">
                    {plan.highlight && (
                      <div className="absolute -top-4 left-0 right-0 flex justify-center">
                        <span className="px-4 py-1 rounded-full text-xs font-bold"
                          style={{ background: 'linear-gradient(135deg, #fbbf24, #d97706)', color: '#020617' }}>
                          Le plus populaire
                        </span>
                      </div>
                    )}
                    <GlassCard
                      glowColor={plan.highlight ? 'amber' : 'blue'}
                      hover={false}
                      className={`h-full flex flex-col p-8 ${plan.highlight ? 'border-amber-400/30' : ''}`}
                    >
                      <div className="mb-6">
                        <h3 className="text-white font-bold text-xl mb-3">{plan.name}</h3>
                        {plan.price !== null ? (
                          <div className="flex items-end gap-1">
                            <span className="text-4xl font-bold text-white">${plan.price.toLocaleString()}</span>
                            <span className="text-slate-400 text-sm mb-1">{plan.period}</span>
                          </div>
                        ) : (
                          <div className="text-3xl font-bold gradient-text">Sur mesure</div>
                        )}
                      </div>

                      <ul className="flex flex-col gap-3 flex-1 mb-8">
                        {plan.features.map(f => (
                          <li key={f} className="flex items-start gap-2.5 text-slate-300 text-sm">
                            <span className="flex-shrink-0 w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center mt-0.5">
                              <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                                <path d="M1 4l2 2 4-4" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </span>
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Link
                        href="/contact"
                        className={plan.highlight ? 'btn-primary py-3.5 text-sm text-center rounded-xl' : 'btn-secondary py-3.5 text-sm text-center rounded-xl'}
                      >
                        {plan.cta}
                      </Link>
                    </GlassCard>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── FAQ ─── */}
        <AnimatedSection className="mt-24 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-10">Questions fréquentes</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                q: 'Les prix sont-ils fixes ou négociables ?',
                a: 'Nos tarifs sont indicatifs. Pour les projets d\'envergure ou les engagements long terme, nous proposons systématiquement des conditions préférentielles. Contactez-nous pour un devis personnalisé.',
              },
              {
                q: 'Y a-t-il un minimum de commande pour l\'annotation ?',
                a: 'Nous acceptons des volumes à partir de 1 000 éléments. En dessous, nous pouvons envisager un projet pilote sur devis pour tester la collaboration.',
              },
              {
                q: 'Comment se déroule le paiement ?',
                a: 'Pour les projets ponctuels : acompte de 40% au démarrage, solde à la livraison. Pour les formules mensuelles : facturation en début de mois. Nous acceptons virements SEPA et Wise.',
              },
              {
                q: 'Quelle est la garantie de qualité pour l\'annotation ?',
                a: 'Chaque dataset passe par un double contrôle qualité (annotateur + réviseur). Nous garantissons un taux de précision minimal de 98%. Au-dessous, nous re-livrons gratuitement.',
              },
            ].map(({ q, a }) => (
              <GlassCard key={q} hover={false} className="p-6">
                <p className="text-white font-semibold mb-2">{q}</p>
                <p className="text-slate-400 text-sm leading-relaxed">{a}</p>
              </GlassCard>
            ))}
          </div>
        </AnimatedSection>

        {/* ─── CTA ─── */}
        <AnimatedSection className="mt-20 text-center">
          <p className="text-slate-400 mb-4">Vous n'avez pas trouvé la formule adaptée ?</p>
          <Link href="/contact" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
            Discutons de votre projet
          </Link>
        </AnimatedSection>
      </section>
    </div>
  )
}

import type { Metadata } from 'next'
import Link from 'next/link'
import GlassCard from '@/components/GlassCard'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Services — Jengu.AI',
  description: 'Découvrez nos services : Conseil en IA, Automatisation intelligente, Annotation de données et Formation IA.',
}

const services = [
  {
    id: 'conseil',
    color: '#3b82f6',
    colorRgb: '59,130,246',
    tag: '01 / Conseil',
    title: 'Conseil Stratégique en IA',
    subtitle: 'De l\'idée à la feuille de route',
    description:
      'Nous auditons votre organisation, identifions les opportunités à fort ROI et construisons avec vous une stratégie IA réaliste et actionnable. Notre approche est pragmatique : pas de promesses irréalistes, des résultats mesurables.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M4 4h7v7H4zM17 4h7v7h-7zM4 17h7v7H4zM17 20a4 4 0 100-8 4 4 0 000 8z"/>
      </svg>
    ),
    benefits: [
      'Audit de maturité IA de votre organisation',
      'Identification des cas d\'usage à fort potentiel',
      'Feuille de route priorisée sur 6 à 24 mois',
      'Étude d\'impact et calcul de ROI prévisionnel',
      'Sélection des technologies et partenaires adaptés',
      'Accompagnement au changement et conduite du projet',
    ],
    deliverables: ['Rapport d\'audit', 'Roadmap IA', 'Business case détaillé'],
  },
  {
    id: 'automatisation',
    color: '#06b6d4',
    colorRgb: '6,182,212',
    tag: '02 / Automatisation',
    title: 'Automatisation Intelligente',
    subtitle: 'Vos processus, augmentés par l\'IA',
    description:
      'Nous concevons et déployons des workflows intelligents qui éliminent les tâches répétitives, réduisent les erreurs et libèrent vos équipes pour des missions à haute valeur ajoutée. Du RPA classique aux agents IA autonomes.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M14 3L3 9l11 6 11-6L14 3zM3 19l11 6 11-6M3 14l11 6 11-6"/>
      </svg>
    ),
    benefits: [
      'Analyse et cartographie de vos processus métier',
      'Développement de workflows IA sur mesure',
      'Intégration avec vos outils existants (ERP, CRM...)',
      'Agents IA conversationnels et autonomes',
      'Monitoring et tableau de bord de performance',
      'Maintenance évolutive et support technique',
    ],
    deliverables: ['Cartographie processus', 'Solution déployée', 'Dashboard de monitoring'],
  },
  {
    id: 'annotation',
    color: '#818cf8',
    colorRgb: '129,140,248',
    tag: '03 / Annotation',
    title: 'Annotation de Données',
    subtitle: 'La matière première de vos modèles IA',
    description:
      'Des données mal annotées = des modèles défaillants. Notre équipe d\'annotateurs spécialisés garantit des datasets de haute qualité pour entraîner, affiner et évaluer vos modèles d\'IA, avec des processus de contrôle qualité rigoureux.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <rect x="3" y="3" width="22" height="22" rx="3"/>
        <path d="M8 14h12M8 9h5M8 19h9"/>
      </svg>
    ),
    benefits: [
      'Classification d\'images et de vidéos',
      'Bounding boxes et segmentation sémantique',
      'Annotation NLP : NER, sentiment, intent',
      'Transcription et annotation audio/speech',
      'Double vérification et contrôle qualité systématique',
      'Livraison dans votre format préféré (JSON, CSV, COCO...)',
    ],
    deliverables: ['Dataset annoté', 'Rapport qualité', 'Ontologie de labels'],
  },
  {
    id: 'formation',
    color: '#fbbf24',
    colorRgb: '251,191,36',
    tag: '04 / Formation',
    title: 'Formation IA',
    subtitle: 'Montez en compétences, durablement',
    description:
      'L\'IA ne remplace pas vos équipes : elle les augmente. Nos programmes de formation, du niveau sensibilisation au niveau expert, donnent à vos collaborateurs les clés pour maîtriser et exploiter les outils IA dans leur quotidien.',
    icon: (
      <svg viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8">
        <path d="M25 11l-11-6L3 11l11 6 11-6zM7 13.5v5C10 21 18 21 21 18.5v-5"/>
      </svg>
    ),
    benefits: [
      'Formations sur mesure adaptées à vos métiers',
      'Prompt engineering et utilisation des LLM',
      'Ateliers pratiques et cas d\'usage réels',
      'Parcours certifiants reconnus',
      'E-learning asynchrone disponible',
      'Suivi post-formation et coaching individuel',
    ],
    deliverables: ['Programme personnalisé', 'Supports de cours', 'Certification'],
  },
]

export default function ServicesPage() {
  return (
    <div className="pt-24">
      {/* ─── Hero ─── */}
      <section className="py-20 text-center relative overflow-hidden"
        style={{ background: 'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(59,130,246,0.15) 0%, transparent 60%)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <AnimatedSection>
            <p className="text-blue-400 text-sm font-semibold tracking-widest uppercase mb-3">Nos expertises</p>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
              Des services conçus pour<br />
              <span className="gradient-text">l'impact réel</span>
            </h1>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto leading-relaxed">
              Quatre domaines d'expertise complémentaires pour couvrir l'ensemble
              de votre parcours de transformation IA.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ─── Service sections ─── */}
      <div className="max-w-7xl mx-auto px-6 pb-24">
        {services.map((svc, idx) => (
          <section key={svc.id} id={svc.id} className="py-20">
            <div className={`grid md:grid-cols-2 gap-14 items-start ${idx % 2 === 1 ? 'md:grid-flow-dense' : ''}`}>
              {/* Content */}
              <AnimatedSection direction={idx % 2 === 0 ? 'left' : 'right'} className={idx % 2 === 1 ? 'md:col-start-2' : ''}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase mb-5"
                  style={{ background: `rgba(${svc.colorRgb},0.12)`, color: svc.color, border: `1px solid rgba(${svc.colorRgb},0.3)` }}>
                  {svc.tag}
                </div>

                <h2 className="text-4xl font-bold text-white mb-2">{svc.title}</h2>
                <p className="text-lg mb-5" style={{ color: svc.color }}>{svc.subtitle}</p>
                <p className="text-slate-400 leading-relaxed mb-8">{svc.description}</p>

                {/* Benefits */}
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {svc.benefits.map(b => (
                    <li key={b} className="flex items-start gap-2.5 text-slate-300 text-sm">
                      <span className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: `rgba(${svc.colorRgb},0.15)`, border: `1px solid rgba(${svc.colorRgb},0.35)` }}>
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                          <path d="M2 5l2 2 4-4" stroke={svc.color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <Link href="/contact" className="btn-primary px-7 py-3.5 text-sm inline-flex items-center gap-2">
                  Demander un devis
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M1 7h12M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </AnimatedSection>

              {/* Card with icon + deliverables */}
              <AnimatedSection direction={idx % 2 === 0 ? 'right' : 'left'} delay={0.15} className={idx % 2 === 1 ? 'md:col-start-1 md:row-start-1' : ''}>
                <GlassCard glowColor={idx === 3 ? 'amber' : idx === 2 ? 'cyan' : 'blue'} hover={false} className="p-8">
                  {/* Icon */}
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                    style={{ background: `rgba(${svc.colorRgb},0.12)`, border: `1px solid rgba(${svc.colorRgb},0.3)`, color: svc.color }}>
                    {svc.icon}
                  </div>

                  <h3 className="text-white font-semibold text-lg mb-2">Ce que vous recevez</h3>
                  <p className="text-slate-500 text-sm mb-5">Livrables inclus dans chaque engagement :</p>

                  <div className="flex flex-col gap-3">
                    {svc.deliverables.map((d, i) => (
                      <div key={d} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: `rgba(${svc.colorRgb},0.06)`, border: `1px solid rgba(${svc.colorRgb},0.12)` }}>
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `rgba(${svc.colorRgb},0.2)`, color: svc.color }}>
                          {i + 1}
                        </span>
                        <span className="text-slate-300 text-sm font-medium">{d}</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider-glow my-6" />

                  <div className="flex items-center gap-3 p-4 rounded-xl"
                    style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)' }}>
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                      <path d="M9 1l2 5h5l-4 3 1.5 5L9 11 4.5 14 6 9 2 6h5z" stroke="#fbbf24" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span className="text-amber-400 text-sm font-medium">Premier échange gratuit & sans engagement</span>
                  </div>
                </GlassCard>
              </AnimatedSection>
            </div>

            {idx < services.length - 1 && <div className="divider-glow mt-20" />}
          </section>
        ))}
      </div>

      {/* ─── CTA ─── */}
      <section className="py-20 max-w-4xl mx-auto px-6 text-center">
        <AnimatedSection>
          <h2 className="text-4xl font-bold text-white mb-5">
            Quel service vous correspond ?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Discutons ensemble de votre contexte pour identifier la meilleure approche.
          </p>
          <Link href="/contact" className="btn-primary px-10 py-4 text-base inline-flex items-center gap-2">
            Démarrer maintenant
          </Link>
        </AnimatedSection>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { Shield, TrendingUp, Users, FileText, Bell, Zap, CheckCircle, ArrowRight, Star } from 'lucide-react'
import { formatXAF } from '@/lib/utils'

const PLANS = [
  {
    id: 'STARTER',
    name: 'Starter',
    prix: 15000,
    prixAnnuel: 144000,
    agents: '5 agents',
    color: 'border-gray-500/30',
    badge: null,
    features: [
      'Pipeline prospects & contrats',
      'KPIs en temps réel',
      '5 agents commerciaux',
      'Produits : Auto, Maladie, Vie',
      'Alertes renouvellements',
      'Support email (48h)',
    ],
  },
  {
    id: 'PRO',
    name: 'Pro',
    prix: 45000,
    prixAnnuel: 432000,
    agents: '25 agents',
    color: 'border-blue-500',
    badge: 'Recommandé',
    features: [
      'Tout Starter inclus',
      "Jusqu'à 25 agents",
      'Gestion des sinistres',
      'Rapports & exports PDF',
      'Gestion des paiements MoMo',
      'Tous produits CIMA',
      'Support prioritaire (24h)',
    ],
  },
  {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    prix: 120000,
    prixAnnuel: 1152000,
    agents: 'Illimité',
    color: 'border-purple-500/50',
    badge: 'Multi-agences',
    features: [
      'Tout Pro inclus',
      'Agents illimités',
      'Multi-agences / succursales',
      'API REST dédiée',
      'Assistant IA (JenguAI)',
      'Formation équipe incluse',
      'Account manager dédié',
      'SLA 99.9% garanti',
    ],
  },
]

const FONCTIONNALITES = [
  { icon: TrendingUp, titre: 'Pipeline Commercial', desc: 'Suivez vos prospects de la prise de contact à la signature. Kanban visuel adapté au marché camerounais.' },
  { icon: FileText, titre: 'Contrats & Devis', desc: 'Gérez tous vos polices d\'assurance conformément aux normes CIMA. Numérotation automatique.' },
  { icon: Bell, titre: 'Alertes Renouvellements', desc: 'Ne perdez plus aucun renouvellement. Alertes automatiques J-30, J-15 et J-7.' },
  { icon: Shield, titre: 'Gestion Sinistres', desc: 'Déclarez, instruisez et clôturez vos sinistres avec traçabilité complète.' },
  { icon: Users, titre: 'Équipes & Zones', desc: 'Gérez vos agents par arrondissement (Douala I-VI). Commissions calculées automatiquement.' },
  { icon: Zap, titre: 'Mobile Money intégré', desc: 'Enregistrez les paiements MTN MoMo et Orange Money directement dans l\'application.' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white">
      {/* Navbar */}
      <nav className="border-b border-[#1f2937] bg-[#0a0f1e]/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Jengu<span className="text-blue-400">Assur</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
            <a href="#fonctionnalites" className="hover:text-white transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-white transition-colors">Tarifs</a>
            <a href="#contact" className="hover:text-white transition-colors">Contact</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-400 hover:text-white transition-colors">Connexion</Link>
            <Link href="/register" className="btn-primary text-sm py-2">Essai gratuit 14j</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/30 rounded-full px-4 py-1.5 text-sm text-blue-400 mb-6">
          <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
          Conçu pour les assurances de Douala & Cameroun
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Gérez votre portefeuille<br />
          <span className="text-gradient">d'assurances simplement</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-10">
          Pipeline commercial, gestion contrats, sinistres et KPIs en temps réel —
          adapté aux normes CIMA et au marché camerounais.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/register" className="btn-primary text-base py-3 px-8 justify-center glow-blue">
            Démarrer gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/login" className="btn-secondary text-base py-3 px-8 justify-center">
            Voir la démo
          </Link>
        </div>
        <p className="text-xs text-gray-500 mt-4">14 jours d'essai gratuit • Pas de carte bancaire requise</p>

        {/* Dashboard preview */}
        <div className="mt-16 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0a0f1e] z-10 bottom-0 top-2/3" />
          <div className="bg-[#111827] border border-[#1f2937] rounded-2xl p-6 text-left shadow-2xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Contrats actifs', val: '142', trend: '+8%', color: 'text-emerald-400' },
                { label: 'CA du mois', val: '4 280 000', suffix: 'XAF', trend: '+12%', color: 'text-blue-400' },
                { label: 'Prospects pipeline', val: '67', trend: '+5', color: 'text-amber-400' },
                { label: 'Sinistres ouverts', val: '9', trend: '-2', color: 'text-red-400' },
              ].map((s) => (
                <div key={s.label} className="stat-card">
                  <p className="text-xs text-gray-500">{s.label}</p>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.val} <span className="text-xs text-gray-500">{s.suffix}</span></p>
                  <p className="text-xs text-emerald-400">{s.trend}</p>
                </div>
              ))}
            </div>
            <div className="h-24 bg-[#1a2235] rounded-lg flex items-center justify-center text-gray-600 text-sm">
              Graphique évolution CA & contrats
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section id="fonctionnalites" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Tout ce qu'il vous faut</h2>
        <p className="text-gray-400 text-center mb-12">Une solution complète pensée pour les acteurs de l'assurance au Cameroun</p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FONCTIONNALITES.map((f) => (
            <div key={f.titre} className="card-glass p-6 hover:border-blue-500/30 transition-colors">
              <div className="w-10 h-10 bg-blue-600/15 rounded-lg flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-semibold mb-2">{f.titre}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tarifs */}
      <section id="tarifs" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-4">Tarifs transparents en XAF</h2>
        <p className="text-gray-400 text-center mb-12">Des forfaits adaptés à la taille de votre structure • -20% avec l'abonnement annuel</p>
        <div className="grid md:grid-cols-3 gap-6">
          {PLANS.map((plan) => (
            <div key={plan.id} className={`relative card-glass border-2 ${plan.color} p-6 flex flex-col`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}
              <div className="mb-6">
                <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">{formatXAF(plan.prix)}</span>
                  <span className="text-gray-400 text-sm">/mois</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">{formatXAF(plan.prixAnnuel)}/an (économisez {formatXAF(plan.prix * 12 - plan.prixAnnuel)})</p>
                <p className="text-sm text-blue-400 mt-2 font-medium">{plan.agents}</p>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/register" className={plan.badge ? 'btn-primary justify-center' : 'btn-secondary justify-center'}>
                Commencer {plan.name}
              </Link>
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8">
          Paiement par Mobile Money (MTN MoMo / Orange Money) • Virement bancaire • Facture fournie
        </p>
      </section>

      {/* Témoignage / CTA */}
      <section className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="card-glass p-10 border-blue-500/20">
          <div className="flex justify-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />)}
          </div>
          <blockquote className="text-lg text-gray-300 italic mb-4">
            "JenguAssur a transformé notre façon de suivre nos agents. On a réduit les pertes de renouvellements de 40% en 3 mois."
          </blockquote>
          <p className="text-sm text-gray-500">Directeur commercial, Courtier en assurance — Douala, Akwa</p>
        </div>
        <div className="mt-12">
          <h2 className="text-3xl font-bold mb-4">Prêt à démarrer ?</h2>
          <p className="text-gray-400 mb-6">Rejoignez les compagnies d'assurance de Douala qui modernisent leur gestion</p>
          <Link href="/register" className="btn-primary text-base py-3 px-10 inline-flex justify-center glow-blue">
            Essai gratuit 14 jours — Sans engagement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1f2937] py-8">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-blue-400" />
            <span>JenguAssur by <span className="text-blue-400">Jengu.AI</span></span>
          </div>
          <p>© {new Date().getFullYear()} Jengu.AI — Douala, Cameroun · Conforme CIMA</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Confidentialité</a>
            <a href="#" className="hover:text-white transition-colors">CGU</a>
            <a href="mailto:contact@jengu.ai" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

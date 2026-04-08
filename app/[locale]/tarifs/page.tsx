'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, Star, Zap } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { TARIFS } from '@/lib/constants';

const fadeIn = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.3 } }),
};

const PLANS = [
  {
    key: 'free',
    tarif: TARIFS.free,
    color: 'text-text-secondary',
    popular: false,
    cta: 'pricing.cta_free',
    features: {
      fr: ['Calculateur IGS (3/mois)', 'Calendrier fiscal complet', 'FAQ complète', '1 question IA / jour'],
      en: ['IGS Calculator (3/month)', 'Full fiscal calendar', 'Complete FAQ', '1 AI question / day'],
    },
  },
  {
    key: 'solo',
    tarif: TARIFS.solo,
    color: 'text-blue-glow',
    popular: false,
    cta: 'pricing.cta',
    features: {
      fr: ['Calculateur IGS illimité', 'Calendrier avec alertes', 'Assistant IA illimité', 'Export PDF des calculs', 'Historique 12 mois'],
      en: ['Unlimited IGS Calculator', 'Calendar with alerts', 'Unlimited AI Assistant', 'PDF export', '12-month history'],
    },
  },
  {
    key: 'pro',
    tarif: TARIFS.pro,
    color: 'text-gold',
    popular: true,
    cta: 'pricing.cta',
    features: {
      fr: ['Tout Solo +', 'Archivage déclarations', 'Alertes WhatsApp & Email', 'Comparaison CGA intégrée', 'Support prioritaire 48h', 'Calcul multi-exercices'],
      en: ['Everything in Solo +', 'Filing archive', 'WhatsApp & Email alerts', 'CGA comparison', 'Priority support 48h', 'Multi-year calculation'],
    },
  },
  {
    key: 'cabinet',
    tarif: TARIFS.cabinet,
    color: 'text-blue-electric',
    popular: false,
    cta: 'pricing.cta_contact',
    features: {
      fr: ['Licence × 10 clients', 'Dashboard multi-clients', 'Rapports consolidés', 'Accès API données', 'Support dédié & onboarding', 'SLA garanti'],
      en: ['10-client license', 'Multi-client dashboard', 'Consolidated reports', 'API data access', 'Dedicated support & onboarding', 'Guaranteed SLA'],
    },
  },
];

export default function TarifsPage() {
  const { t } = useT();
  const { locale } = useLangStore();
  const [annual, setAnnual] = useState(false);
  const lang = locale === 'en' ? 'en' : 'fr';

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-8">
      {/* Header */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn} className="text-center">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
          {locale === 'fr' ? 'Nos forfaits' : 'Our plans'}
        </h1>
        <p className="text-text-secondary text-sm">
          {locale === 'fr'
            ? 'En FCFA · Aucun frais de change · Annulation à tout moment'
            : 'In FCFA · No exchange fees · Cancel anytime'}
        </p>
      </motion.div>

      {/* Toggle mensuel / annuel */}
      <motion.div
        initial="hidden" animate="visible" custom={1} variants={fadeIn}
        className="flex items-center justify-center gap-3"
      >
        <span className={`text-sm font-body font-semibold transition-colors ${!annual ? 'text-text-primary' : 'text-text-muted'}`}>
          {locale === 'fr' ? 'Mensuel' : 'Monthly'}
        </span>
        <button
          onClick={() => setAnnual(v => !v)}
          className="relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-electric"
          style={{ background: annual ? '#2d7ff9' : '#162035' }}
          aria-label="Toggle billing period"
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
        </button>
        <span className={`text-sm font-body font-semibold transition-colors ${annual ? 'text-text-primary' : 'text-text-muted'}`}>
          {locale === 'fr' ? 'Annuel' : 'Annual'}
        </span>
        {annual && (
          <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-gold/20 text-gold border border-gold/30">
            {locale === 'fr' ? '2 mois offerts' : '2 months free'}
          </span>
        )}
      </motion.div>

      {/* Cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLANS.map(({ key, tarif, color, popular, cta, features }, i) => {
          const price = annual ? tarif.prix_annuel : tarif.prix_mensuel;
          const isFree = tarif.prix_mensuel === 0;

          return (
            <motion.div key={key} initial="hidden" animate="visible" custom={i + 2} variants={fadeIn} className="relative">
              {popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold bg-gold text-navy-deep whitespace-nowrap">
                    <Star className="w-3 h-3" />
                    {locale === 'fr' ? 'Le plus populaire' : 'Most popular'}
                  </span>
                </div>
              )}

              <Card
                padding="lg"
                glow={popular ? 'gold' : 'none'}
                className={`h-full flex flex-col ${popular ? 'border-gold/25' : ''}`}
              >
                {/* Plan name */}
                <div className="mb-5">
                  <h3 className={`font-display text-lg font-bold ${color}`}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5 mb-4">
                    {key === 'free'    ? (locale === 'fr' ? 'Pour découvrir Fisco.IA'        : 'Discover Fisco.IA')            : ''}
                    {key === 'solo'    ? (locale === 'fr' ? 'Pour les auto-entrepreneurs'     : 'For sole traders')             : ''}
                    {key === 'pro'     ? (locale === 'fr' ? 'Pour les PME actives'            : 'For active SMEs')              : ''}
                    {key === 'cabinet' ? (locale === 'fr' ? 'Pour les CGAs et experts'        : 'For CGAs & accountants')       : ''}
                  </p>

                  {/* Price */}
                  {isFree ? (
                    <div className="flex items-baseline gap-1">
                      <span className="font-display text-4xl font-bold text-text-primary">0</span>
                      <span className="text-sm text-text-muted">FCFA</span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-baseline gap-1">
                        <span className="font-display text-4xl font-bold text-text-primary">
                          {price.toLocaleString('fr-FR')}
                        </span>
                        <span className="text-sm text-text-muted">
                          FCFA{annual ? (locale === 'fr' ? '/an' : '/yr') : (locale === 'fr' ? '/mois' : '/mo')}
                        </span>
                      </div>
                      {annual && (
                        <p className="text-[11px] text-text-muted mt-0.5 line-through">
                          {(tarif.prix_mensuel * 12).toLocaleString('fr-FR')} FCFA/{locale === 'fr' ? 'an' : 'yr'}
                        </p>
                      )}
                      {!annual && (
                        <p className="text-[11px] text-success mt-0.5">
                          {locale === 'fr'
                            ? `ou ${tarif.prix_annuel.toLocaleString('fr-FR')} FCFA/an`
                            : `or ${tarif.prix_annuel.toLocaleString('fr-FR')} FCFA/yr`}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-2 flex-1 mb-6">
                  {features[lang].map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm font-body text-text-secondary">
                      <Check className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link href={`/${locale}/dashboard`}>
                  <Button
                    variant={popular ? 'primary' : isFree ? 'ghost' : 'outline'}
                    className="w-full"
                  >
                    {isFree
                      ? (locale === 'fr' ? 'Commencer gratuitement' : 'Get started free')
                      : key === 'cabinet'
                      ? (locale === 'fr' ? 'Nous contacter' : 'Contact us')
                      : (locale === 'fr' ? 'Choisir ce forfait' : 'Choose this plan')}
                  </Button>
                </Link>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Payment methods */}
      <motion.div initial="hidden" animate="visible" custom={6} variants={fadeIn} className="text-center space-y-2">
        <p className="text-sm text-text-muted">
          💳 {locale === 'fr'
            ? 'Paiement : MTN MoMo · Orange Money · Virement bancaire'
            : 'Payment: MTN MoMo · Orange Money · Bank transfer'}
        </p>
        <p className="text-xs text-text-muted">
          {locale === 'fr'
            ? 'Pas de carte bancaire requise pour le forfait Free · Annulation sans frais à tout moment'
            : 'No credit card required for Free plan · Cancel anytime at no cost'}
        </p>
      </motion.div>

      {/* CGA info box */}
      <motion.div initial="hidden" animate="visible" custom={7} variants={fadeIn}>
        <Card padding="md" glow="blue" className="border-blue-electric/20">
          <div className="flex items-start gap-3">
            <Zap className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-display text-base font-semibold text-text-primary mb-1">
                {locale === 'fr' ? 'Membre d\'un CGA ? Économisez 50%' : 'CGA member? Save 50%'}
              </h3>
              <p className="text-sm text-text-secondary">
                {locale === 'fr'
                  ? 'Les membres d\'un Centre de Gestion Agréé bénéficient d\'un abattement de 50% sur la contribution des licences (Art. C37 — LF 2026). Le forfait Pro revient à ~4 950 FCFA/mois pour un membre CGA.'
                  : 'CGA members benefit from a 50% reduction on business license fees (Art. C37 — FL 2026). The Pro plan costs ~4,950 FCFA/month for a CGA member.'}
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

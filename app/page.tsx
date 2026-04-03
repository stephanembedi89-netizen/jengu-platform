'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calculator, Calendar, MessageCircle, Scale,
  ArrowRight, Check, ChevronRight, ExternalLink,
  AlertTriangle, Shield, Zap, Star
} from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import LanguageToggle from '@/components/ui/LanguageToggle';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Disclaimer from '@/components/ui/Disclaimer';
import { formatFCFA } from '@/lib/utils';
import { COMPANY_URL, IMPOTS_CM_URL, TARIFS } from '@/lib/constants';

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.38, ease: 'easeOut' }
  }),
};

export default function LandingPage() {
  const { t } = useT();
  const { locale } = useLangStore();

  const problems = [
    { titleKey: 'problems.p1.title', descKey: 'problems.p1.desc', icon: AlertTriangle },
    { titleKey: 'problems.p2.title', descKey: 'problems.p2.desc', icon: Calendar },
    { titleKey: 'problems.p3.title', descKey: 'problems.p3.desc', icon: Scale },
  ];

  const solutions = [
    { titleKey: 'solutions.s1.title', descKey: 'solutions.s1.desc', icon: Calendar },
    { titleKey: 'solutions.s2.title', descKey: 'solutions.s2.desc', icon: Calculator },
    { titleKey: 'solutions.s3.title', descKey: 'solutions.s3.desc', icon: MessageCircle },
  ];

  const features = [
    { titleKey: 'features.calc.title', descKey: 'features.calc.desc', icon: Calculator, color: 'text-blue-electric', bg: 'bg-blue-electric/10' },
    { titleKey: 'features.cal.title',  descKey: 'features.cal.desc',  icon: Calendar,    color: 'text-gold',          bg: 'bg-gold-soft' },
    { titleKey: 'features.ai.title',   descKey: 'features.ai.desc',   icon: MessageCircle, color: 'text-success',    bg: 'bg-success-bg' },
    { titleKey: 'features.legal.title',descKey: 'features.legal.desc',icon: Shield,      color: 'text-blue-glow',     bg: 'bg-blue-muted/30' },
  ];

  const pricingPlans = [
    {
      key: 'starter',
      price: TARIFS.starter.prix,
      featuresKey: 'pricing.starter.features' as const,
      features: locale === 'en'
        ? ['IGS Calculator', 'Fiscal calendar', 'Full FAQ']
        : ['Calculateur IGS', 'Calendrier fiscal', 'FAQ complète'],
      popular: false,
    },
    {
      key: 'business',
      price: TARIFS.business.prix,
      featuresKey: 'pricing.business.features' as const,
      features: locale === 'en'
        ? ['Everything in Starter +', 'Unlimited AI Assistant', 'Filing archive', 'WhatsApp alerts']
        : ['Tout Starter +', 'Assistant IA illimité', 'Archivage déclarations', 'Alertes WhatsApp'],
      popular: true,
    },
    {
      key: 'cabinet',
      price: TARIFS.cabinet.prix,
      featuresKey: 'pricing.cabinet.features' as const,
      features: locale === 'en'
        ? ['10-client license', 'Ideal for CGAs', 'Priority support', 'Multi-client dashboard']
        : ['Licence × 10 clients', 'Idéal pour CGA', 'Support prioritaire', 'Tableau multi-clients'],
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-navy-deep text-text-primary overflow-hidden">
      <Disclaimer />

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-40 h-14 bg-navy-deep/80 backdrop-blur-md border-b border-navy-border flex items-center px-6 gap-4">
        <Link href="/" className="font-display text-xl font-bold text-text-primary tracking-tight flex-1">
          Fisco.IA
        </Link>
        <Link
          href={`/${locale}/dashboard`}
          className="hidden sm:inline-flex items-center gap-1.5 text-sm font-body text-text-secondary hover:text-text-primary transition-colors"
        >
          {locale === 'fr' ? 'Application' : 'App'}
        </Link>
        <LanguageToggle />
        <Link href={`/${locale}/dashboard`}>
          <Button size="sm">
            {locale === 'fr' ? 'Commencer' : 'Get started'}
          </Button>
        </Link>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 text-center overflow-hidden">
        {/* Gradient mesh background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(26,127,255,0.07)_0%,transparent_70%)] translate-x-1/4 -translate-y-1/4" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(240,165,0,0.04)_0%,transparent_70%)] -translate-x-1/4 translate-y-1/4" />
        </div>

        <div className="relative max-w-3xl mx-auto">
          {/* Badge */}
          <motion.div
            initial="hidden" animate="visible" custom={0} variants={fadeIn}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-body font-semibold bg-blue-electric/10 text-blue-glow border border-blue-electric/20 mb-6"
          >
            🇨🇲 {t('hero.badge')}
          </motion.div>

          {/* Titre */}
          <motion.h1
            initial="hidden" animate="visible" custom={1} variants={fadeIn}
            className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight mb-6"
          >
            {t('hero.title')}
          </motion.h1>

          {/* Sous-titre */}
          <motion.p
            initial="hidden" animate="visible" custom={2} variants={fadeIn}
            className="text-lg sm:text-xl text-text-secondary max-w-xl mx-auto mb-8 leading-relaxed"
          >
            {t('hero.subtitle')}
          </motion.p>

          {/* CTA */}
          <motion.div
            initial="hidden" animate="visible" custom={3} variants={fadeIn}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-10"
          >
            <Link href={`/${locale}/dashboard`}>
              <Button size="lg" className="w-full sm:w-auto">
                {t('hero.cta_primary')} <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href={`/${locale}/calculateur`}>
              <Button variant="ghost" size="lg" className="w-full sm:w-auto">
                {t('hero.cta_secondary')}
              </Button>
            </Link>
          </motion.div>

          {/* Badges de réassurance */}
          <motion.div
            initial="hidden" animate="visible" custom={4} variants={fadeIn}
            className="flex flex-wrap justify-center gap-3"
          >
            {[t('hero.badge_lf'), t('hero.badge_igs'), t('hero.badge_dgi'), t('hero.badge_sources')].map((badge) => (
              <span
                key={badge}
                className="px-3 py-1 rounded-full text-xs font-body font-semibold bg-navy-card border border-navy-border text-text-secondary"
              >
                {badge}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── PROBLÈME → SOLUTION ── */}
      <section className="py-20 px-6 bg-navy-mid/40">
        <div className="max-w-5xl mx-auto">
          {/* Problèmes */}
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-display text-3xl font-bold text-center text-text-primary mb-2"
          >
            {t('problems.title')}
          </motion.h2>
          <span className="title-underline mx-auto mb-10" />

          <div className="grid sm:grid-cols-3 gap-4 mb-10">
            {problems.map(({ titleKey, descKey, icon: Icon }, i) => (
              <motion.div
                key={titleKey}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
              >
                <Card padding="md" className="border-danger/20 bg-danger-bg/30 hover:border-danger/35">
                  <Icon className="w-8 h-8 text-danger mb-3" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-text-primary mb-1">{t(titleKey)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(descKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Flèche de transition */}
          <div className="flex justify-center mb-10">
            <div className="flex flex-col items-center gap-1">
              <span className="text-xl">↓</span>
              <span className="text-xs font-body text-text-muted uppercase tracking-widest">Fisco.IA</span>
              <span className="text-xl text-blue-electric">↓</span>
            </div>
          </div>

          {/* Solutions */}
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-display text-3xl font-bold text-center text-text-primary mb-2"
          >
            {t('solutions.title')}
          </motion.h2>
          <span className="title-underline mx-auto mb-10" />

          <div className="grid sm:grid-cols-3 gap-4">
            {solutions.map(({ titleKey, descKey, icon: Icon }, i) => (
              <motion.div
                key={titleKey}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
              >
                <Card padding="md" className="border-blue-electric/20 hover:border-blue-electric/35">
                  <Icon className="w-8 h-8 text-blue-electric mb-3" aria-hidden="true" />
                  <h3 className="font-display text-base font-semibold text-text-primary mb-1">{t(titleKey)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(descKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FONCTIONNALITÉS ── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-display text-3xl font-bold text-center text-text-primary mb-2"
          >
            {t('features.title')}
          </motion.h2>
          <span className="title-underline mx-auto mb-12" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {features.map(({ titleKey, descKey, icon: Icon, color, bg }, i) => (
              <motion.div
                key={titleKey}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
              >
                <Card padding="md" className="h-full text-center group">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-250`}>
                    <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-base font-semibold text-text-primary mb-2">{t(titleKey)}</h3>
                  <p className="text-sm text-text-secondary leading-relaxed">{t(descKey)}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TARIFS ── */}
      <section className="py-20 px-6 bg-navy-mid/30">
        <div className="max-w-5xl mx-auto">
          <motion.h2
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="font-display text-3xl font-bold text-center text-text-primary mb-2"
          >
            {t('pricing.title')}
          </motion.h2>
          <p className="text-center text-text-secondary text-sm mb-12">{t('pricing.subtitle')}</p>

          <div className="grid sm:grid-cols-3 gap-5">
            {pricingPlans.map(({ key, price, features: featureList, popular }, i) => (
              <motion.div
                key={key}
                initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeIn}
                className="relative"
              >
                {popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-body font-700 bg-gold text-navy-deep">
                      <Star className="w-3 h-3" aria-hidden="true" />
                      {t('pricing.popular')}
                    </span>
                  </div>
                )}
                <Card
                  padding="lg"
                  glow={popular ? 'gold' : 'none'}
                  className={`h-full flex flex-col ${popular ? 'border-gold/30 bg-navy-card' : ''}`}
                >
                  <div className="mb-4">
                    <h3 className="font-display text-xl font-bold text-text-primary capitalize">{t(`pricing.${key}.name`)}</h3>
                    <div className="mt-3 flex items-baseline gap-1">
                      <span className="font-display text-3xl font-bold text-text-primary">
                        {formatFCFA(price).replace(' FCFA', '')}
                      </span>
                      <span className="text-sm text-text-muted font-body">
                        FCFA{t('pricing.per_month')}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {featureList.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm font-body text-text-secondary">
                        <Check className="w-4 h-4 text-success flex-shrink-0" aria-hidden="true" />
                        {feat}
                      </li>
                    ))}
                  </ul>

                  <Link href={`/${locale}/dashboard`}>
                    <Button
                      variant={popular ? 'primary' : 'outline'}
                      className="w-full"
                    >
                      {t('pricing.cta')}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-xs text-text-muted mt-6">
            💳 {t('pricing.payment')}
          </p>
        </div>
      </section>

      {/* ── NÉ À DOUALA ── */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gold-soft border border-gold/20 mb-6">
              <span className="text-3xl">🌊</span>
            </div>
            <h2 className="font-display text-3xl font-bold text-text-primary mb-6">
              {t('about.title')}
            </h2>
            <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl mx-auto">
              {t('about.text')}
            </p>
            <a
              href={COMPANY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-glow hover:text-blue-electric transition-colors font-body font-semibold"
            >
              {t('about.link')}
              <ExternalLink className="w-4 h-4" aria-hidden="true" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER LANDING ── */}
      <footer className="border-t border-navy-border bg-navy-mid/60 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm font-body text-text-muted">
              <span className="font-display text-base font-bold text-text-primary">Fisco.IA</span>
              <span>·</span>
              <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-glow transition-colors">
                Jengu.AI
              </a>
              <span>·</span>
              <span>Douala, Cameroun 🇨🇲</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-text-muted">
              <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">{t('footer.legal')}</Link>
              <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">{t('footer.cgu')}</Link>
              <a href={IMPOTS_CM_URL} target="_blank" rel="noopener noreferrer" className="hover:text-text-secondary transition-colors flex items-center gap-1">
                impots.cm <ExternalLink className="w-3 h-3" aria-hidden="true" />
              </a>
            </div>
          </div>
          <p className="text-center text-[11px] text-text-muted border-t border-navy-border pt-4">
            ⚠️ {t('footer.disclaimer')}
          </p>
          <p className="text-center text-[10px] text-text-muted mt-1">
            © 2026 Jengu.AI. {t('footer.rights')}
          </p>
        </div>
      </footer>
    </div>
  );
}

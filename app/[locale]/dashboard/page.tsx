'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calculator, Calendar, MessageCircle, Scale,
  HelpCircle, ExternalLink, AlertTriangle, CheckCircle,
  TrendingUp, Clock, Briefcase
} from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { CALENDRIER_2026 } from '@/lib/fiscal-data-2026';
import { isUrgent, joursRestants, formatDate } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { IMPOTS_CM_URL } from '@/lib/constants';

const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.07, duration: 0.35 } }),
};

const SHORTCUTS = [
  { key: 'calculateur', icon: Calculator, color: 'text-blue-electric', bg: 'bg-blue-electric/10', labelKey: 'nav.calculateur' },
  { key: 'calendrier',  icon: Calendar,   color: 'text-gold',          bg: 'bg-gold-soft',        labelKey: 'nav.calendrier' },
  { key: 'assistant',   icon: MessageCircle, color: 'text-success',    bg: 'bg-success-bg',       labelKey: 'nav.assistant' },
  { key: 'legal',       icon: Scale,      color: 'text-blue-glow',     bg: 'bg-blue-muted/30',    labelKey: 'nav.legal' },
] as const;

export default function DashboardPage() {
  const { t } = useT();
  const { locale } = useLangStore();

  // Trouver la prochaine échéance
  const prochaine = CALENDRIER_2026.find(e => joursRestants(e.date) >= 0);
  const urgentes = CALENDRIER_2026.filter(e => isUrgent(e.date) && joursRestants(e.date) >= 0);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Bienvenue */}
      <motion.div initial="hidden" animate="visible" variants={fadeIn}>
        <h1 className="font-display text-3xl font-bold text-text-primary">
          {t('dashboard.welcome')}
        </h1>
        <p className="text-text-secondary mt-1">{t('dashboard.welcome_sub')}</p>
      </motion.div>

      {/* Alerte urgente */}
      {urgentes.length > 0 && (
        <motion.div initial="hidden" animate="visible" custom={1} variants={fadeIn}>
          {urgentes.map(e => {
            const jours = joursRestants(e.date);
            const label = locale === 'en' ? e.label_en : e.label_fr;
            return (
              <div
                key={e.date}
                className="p-5 rounded-card border border-gold/35 bg-gold-soft pulse-gold"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-start gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge color="urgent" pulse>⚠️ {t('dashboard.urgent_title')}</Badge>
                      </div>
                      <p className="font-body font-semibold text-text-primary">{label}</p>
                      <p className="text-sm text-gold">
                        {formatDate(e.date, locale)} —{' '}
                        {t('dashboard.urgent_days', { n: jours })}
                      </p>
                      <p className="text-xs text-text-muted mt-1">{t('dashboard.urgent_desc')}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/${locale}/calculateur`}>
                      <Button size="sm">{t('dashboard.calc_cta')}</Button>
                    </Link>
                    <a href={IMPOTS_CM_URL} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="sm">
                        {t('dashboard.impots_cta')} <ExternalLink className="w-3 h-3" aria-hidden="true" />
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Prochaine échéance */}
        <motion.div initial="hidden" animate="visible" custom={2} variants={fadeIn}>
          <Card padding="md" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <span className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">
                {t('dashboard.next_deadline')}
              </span>
            </div>
            {prochaine ? (
              <>
                <p className="font-display text-lg font-bold text-text-primary leading-tight">
                  {formatDate(prochaine.date, locale)}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {locale === 'en' ? prochaine.label_en : prochaine.label_fr}
                </p>
                {joursRestants(prochaine.date) <= 30 && (
                  <Badge color="urgent" className="mt-2" dot>
                    {t('dashboard.days_left', { n: joursRestants(prochaine.date) })}
                  </Badge>
                )}
              </>
            ) : (
              <p className="text-sm text-text-muted">{t('calendar.no_more')}</p>
            )}
          </Card>
        </motion.div>

        {/* Régime fiscal */}
        <motion.div initial="hidden" animate="visible" custom={3} variants={fadeIn}>
          <Card padding="md" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <span className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">
                {t('dashboard.regime')}
              </span>
            </div>
            <Badge color="blue" className="text-sm">{t('dashboard.regime_igs')}</Badge>
            <p className="text-xs text-text-muted mt-2">CA &lt; 50M FCFA</p>
          </Card>
        </motion.div>

        {/* Dernier calcul */}
        <motion.div initial="hidden" animate="visible" custom={4} variants={fadeIn}>
          <Card padding="md" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <span className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">
                {t('dashboard.last_calc')}
              </span>
            </div>
            <p className="font-display text-2xl font-bold text-text-muted">—</p>
            <p className="text-xs text-text-muted mt-1">{t('dashboard.no_calc')}</p>
            <Link href={`/${locale}/calculateur`}>
              <Button variant="ghost" size="sm" className="mt-2 text-xs px-2 py-1 h-auto min-h-0">
                {locale === 'fr' ? 'Calculer →' : 'Calculate →'}
              </Button>
            </Link>
          </Card>
        </motion.div>

        {/* Statut conformité */}
        <motion.div initial="hidden" animate="visible" custom={5} variants={fadeIn}>
          <Card padding="md" className="h-full">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-text-muted" aria-hidden="true" />
              <span className="text-xs font-body font-semibold text-text-muted uppercase tracking-wider">
                {t('dashboard.compliance')}
              </span>
            </div>
            <Badge color="gold">{t('dashboard.compliance_check')}</Badge>
            <p className="text-xs text-text-muted mt-2">
              {locale === 'fr'
                ? 'Vérifiez sur impots.cm'
                : 'Verify on impots.cm'}
            </p>
          </Card>
        </motion.div>
      </div>

      {/* Raccourcis rapides */}
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
          {t('dashboard.shortcuts')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {SHORTCUTS.map(({ key, icon: Icon, color, bg, labelKey }, i) => (
            <motion.div key={key} initial="hidden" animate="visible" custom={i + 6} variants={fadeIn}>
              <Link href={`/${locale}/${key}`}>
                <Card padding="md" className="text-center cursor-pointer group h-full">
                  <div className={`w-12 h-12 rounded-2xl ${bg} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
                  </div>
                  <p className="text-sm font-body font-semibold text-text-primary">{t(labelKey)}</p>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Actualités LF 2026 */}
      <section>
        <h2 className="font-display text-xl font-semibold text-text-primary mb-4">
          {t('dashboard.news_title')}
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { titleKey: 'dashboard.news1.title', descKey: 'dashboard.news1.desc', icon: '📋' },
            { titleKey: 'dashboard.news2.title', descKey: 'dashboard.news2.desc', icon: '💡' },
            { titleKey: 'dashboard.news3.title', descKey: 'dashboard.news3.desc', icon: '👥' },
          ].map(({ titleKey, descKey, icon }, i) => (
            <motion.div key={titleKey} initial="hidden" animate="visible" custom={i + 10} variants={fadeIn}>
              <Card padding="md" className="h-full">
                <span className="text-2xl mb-3 block" aria-hidden="true">{icon}</span>
                <h3 className="font-display text-sm font-semibold text-text-primary mb-2">{t(titleKey)}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{t(descKey)}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Encart CGA */}
      <motion.div initial="hidden" animate="visible" custom={13} variants={fadeIn}>
        <Card padding="md" glow="blue" className="border-blue-electric/20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl" aria-hidden="true">💡</span>
                <h3 className="font-display text-base font-semibold text-text-primary">
                  {t('dashboard.cga_title')}
                </h3>
              </div>
              <p className="text-sm text-text-secondary">{t('dashboard.cga_desc')}</p>
            </div>
            <Link href={`/${locale}/faq`} className="flex-shrink-0">
              <Button variant="ghost" size="sm">{t('dashboard.cga_link')}</Button>
            </Link>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

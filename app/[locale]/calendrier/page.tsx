'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { List, LayoutGrid, Download, ExternalLink } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { CALENDRIER_2026, TYPE_INFO, type TypeEcheance } from '@/lib/fiscal-data-2026';
import { isDatePassee, isUrgent, joursRestants, formatDate, exporterCalendrier } from '@/lib/utils';
import DeadlineCard from '@/components/modules/Calendar/DeadlineCard';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

type View = 'list' | 'grid';

export default function CalendrierPage() {
  const { t } = useT();
  const { locale } = useLangStore();
  const [view, setView] = useState<View>('list');

  const urgentes = CALENDRIER_2026.filter(e => isUrgent(e.date));
  const now = new Date();

  // Grouper par mois pour la vue grille
  const byMonth: Record<string, typeof CALENDRIER_2026> = {};
  CALENDRIER_2026.forEach(e => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(e);
  });

  const monthNames = {
    fr: ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'],
    en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-text-primary mb-1">
            {t('calendar.title')}
          </h1>
          <p className="text-text-secondary text-sm">{t('calendar.subtitle')}</p>
        </div>

        {/* Contrôles */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Toggle vue */}
          <div className="flex items-center bg-navy-border/40 rounded-xl p-0.5 border border-navy-border">
            {(['list', 'grid'] as View[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                aria-label={v === 'list' ? t('calendar.view_list') : t('calendar.view_grid')}
                aria-pressed={view === v}
                className={cn(
                  'p-2 rounded-lg transition-all',
                  view === v ? 'bg-blue-electric text-white' : 'text-text-muted hover:text-text-secondary'
                )}
              >
                {v === 'list' ? <List className="w-4 h-4" aria-hidden="true" /> : <LayoutGrid className="w-4 h-4" aria-hidden="true" />}
              </button>
            ))}
          </div>

          {/* Export tout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exporterCalendrier(CALENDRIER_2026, locale)}
          >
            <Download className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('calendar.export_all')}</span>
          </Button>
        </div>
      </div>

      {/* Légende types */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(Object.entries(TYPE_INFO) as [TypeEcheance, typeof TYPE_INFO[TypeEcheance]][]).map(([type, info]) => (
          <span
            key={type}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-body font-semibold border"
            style={{ backgroundColor: info.bgColor, color: info.color, borderColor: `${info.color}30` }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: info.color }} />
            {type}
          </span>
        ))}
      </div>

      {/* Alerte urgente */}
      {urgentes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-card border border-gold/35 bg-gold-soft pulse-gold"
        >
          {urgentes.map(e => {
            const jours = joursRestants(e.date);
            const label = locale === 'en' ? e.label_en : e.label_fr;
            return (
              <div key={e.date} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge color="urgent" pulse dot>⚠️ {t('calendar.urgent')}</Badge>
                  </div>
                  <p className="font-body font-semibold text-text-primary">{label}</p>
                  <p className="text-sm text-gold font-semibold">
                    {formatDate(e.date, locale)} — {t('calendar.days_left', { n: jours })}
                  </p>
                </div>
                <a
                  href="https://www.impots.cm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-body font-semibold text-gold hover:text-gold-light transition-colors"
                >
                  impots.cm <ExternalLink className="w-3 h-3" aria-hidden="true" />
                </a>
              </div>
            );
          })}
        </motion.div>
      )}

      {/* Vue liste */}
      {view === 'list' && (
        <div className="space-y-3">
          {CALENDRIER_2026.map((echeance, i) => (
            <motion.div
              key={echeance.date}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <DeadlineCard echeance={echeance} />
            </motion.div>
          ))}
        </div>
      )}

      {/* Vue grille mensuelle */}
      {view === 'grid' && (
        <div className="space-y-8">
          {Object.entries(byMonth).map(([monthKey, echeances]) => {
            const [year, month] = monthKey.split('-');
            const monthName = monthNames[locale][parseInt(month) - 1];

            return (
              <div key={monthKey}>
                <h3 className="font-display text-lg font-semibold text-text-secondary mb-3">
                  {monthName} {year}
                </h3>
                <div className="space-y-2">
                  {echeances.map(e => (
                    <DeadlineCard key={e.date} echeance={e} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Note bas de page */}
      <div className="mt-8 p-4 rounded-xl bg-navy-card/40 border border-navy-border text-center">
        <p className="text-xs text-text-muted">
          📲 {t('calendar.note')}
        </p>
      </div>
    </div>
  );
}

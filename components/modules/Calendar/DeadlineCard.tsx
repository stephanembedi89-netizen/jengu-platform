'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarPlus, ChevronDown, Info } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import type { Echeance } from '@/lib/fiscal-data-2026';
import { TYPE_INFO } from '@/lib/fiscal-data-2026';
import { joursRestants, isDatePassee, isUrgent, formatDate, genererICS } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';

interface DeadlineCardProps {
  echeance: Echeance;
}

export default function DeadlineCard({ echeance }: DeadlineCardProps) {
  const { t } = useT();
  const { locale } = useLangStore();
  const [expanded, setExpanded] = useState(false);

  const passed = isDatePassee(echeance.date);
  const urgent = !passed && isUrgent(echeance.date);
  const jours = joursRestants(echeance.date);
  const typeInfo = TYPE_INFO[echeance.type];

  const label = locale === 'en' ? echeance.label_en : echeance.label_fr;
  const description = locale === 'en' ? echeance.description_en : echeance.description_fr;

  function exportICS() {
    const ics = genererICS(echeance, locale);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiscoai-${echeance.type}-${echeance.date}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-card border p-5 transition-all duration-200',
        passed
          ? 'bg-navy-card/30 border-navy-border opacity-50'
          : urgent
          ? 'bg-navy-card border-gold/30 pulse-gold'
          : 'bg-navy-card border-navy-border hover:border-blue-electric/25'
      )}
    >
      <div className="flex items-start gap-4">
        {/* Type badge */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ backgroundColor: typeInfo.bgColor }}
        >
          <span className="text-xs font-body font-700" style={{ color: typeInfo.color }}>
            {echeance.type}
          </span>
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className={cn(
              'font-body text-sm font-semibold',
              passed ? 'line-through text-text-muted' : 'text-text-primary'
            )}>
              {label}
            </span>
            {urgent && (
              <Badge color="urgent" pulse dot>
                {t('calendar.urgent')}
              </Badge>
            )}
            {passed && (
              <Badge color="gray">
                {t('calendar.passed')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 text-sm text-text-muted">
            <span className="font-display font-semibold">
              {formatDate(echeance.date, locale)}
            </span>
            {!passed && (
              <span className={cn(
                'font-body text-xs font-semibold px-2 py-0.5 rounded-full',
                urgent ? 'bg-gold-soft text-gold' : 'bg-navy-border text-text-secondary'
              )}>
                {jours === 0
                  ? t('calendar.today')
                  : t('calendar.days_left', { n: jours })}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {!passed && (
            <button
              onClick={exportICS}
              aria-label={t('calendar.add_calendar')}
              title={t('calendar.add_calendar')}
              className="p-2 rounded-lg text-text-muted hover:text-blue-glow hover:bg-navy-border/50 transition-all"
            >
              <CalendarPlus className="w-4 h-4" aria-hidden="true" />
            </button>
          )}
          <button
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="Plus d'informations"
            className="p-2 rounded-lg text-text-muted hover:text-text-secondary hover:bg-navy-border/50 transition-all"
          >
            {expanded ? (
              <ChevronDown className="w-4 h-4 rotate-180 transition-transform" aria-hidden="true" />
            ) : (
              <Info className="w-4 h-4" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Détail expandable */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-4 pt-4 border-t border-navy-border">
              <p className="text-sm text-text-secondary leading-relaxed">{description}</p>
              <p className="text-xs text-text-muted mt-2 italic">
                {locale === 'fr'
                  ? `Source : LF 2026 · Art. C38-C44 CGI`
                  : `Source: Finance Law 2026 · Art. C38-C44 GTC`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

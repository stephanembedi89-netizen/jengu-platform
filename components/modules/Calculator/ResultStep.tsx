'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Check, Calendar, MessageCircle, RefreshCcw } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import type { IGSResult, Secteur, Zone } from '@/lib/fiscal-data-2026';
import { SECTEUR_INFO } from '@/lib/fiscal-data-2026';
import { formatFCFA, copierDansPressesPapier, formaterResultatIGS } from '@/lib/utils';
import Button from '@/components/ui/Button';

interface ResultStepProps {
  result: IGSResult;
  secteur: Secteur;
  zone: Zone;
  membreCGA: boolean;
  onReset: () => void;
}

/** Anime un compteur de 0 vers une valeur cible */
function useCounter(target: number, duration = 800) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.round(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);

  return value;
}

function AnimatedAmount({ value, className = '' }: { value: number; className?: string }) {
  const animated = useCounter(value);
  return <span className={className}>{formatFCFA(animated)}</span>;
}

export default function ResultStep({ result, secteur, zone, membreCGA, onReset }: ResultStepProps) {
  const { t, locale } = useT();
  const { locale: lang } = useLangStore();
  const [copied, setCopied] = useState(false);

  const secteurInfo = SECTEUR_INFO[secteur];
  const secteurLabel = lang === 'en' ? secteurInfo.label_en : secteurInfo.label_fr;

  async function handleCopy() {
    const texte = formaterResultatIGS(result, lang);
    const ok = await copierDansPressesPapier(texte);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  const rows = [
    {
      label: t('calc.base'),
      detail: `${result.taux}% × CA`,
      value: result.base,
      sign: '',
    },
    result.abattementRural > 0 && {
      label: t('calc.abatt_rural'),
      detail: '-30%',
      value: result.abattementRural,
      sign: '-',
    },
    {
      label: t('calc.cac'),
      detail: '+10%',
      value: result.cac,
      sign: '+',
    },
    result.abattementCGA > 0 && {
      label: t('calc.abatt_cga'),
      detail: '-50%',
      value: result.abattementCGA,
      sign: '-',
    },
  ].filter(Boolean) as { label: string; detail: string; value: number; sign: string }[];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* En-tête résultat */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-success text-xl" aria-hidden="true">✅</span>
        <h2 className="font-display text-2xl font-bold text-text-primary">{t('calc.result_title')}</h2>
      </div>
      <p className="text-text-muted text-sm mb-6">
        {secteurLabel} · {zone === 'rural' ? t('calc.zone_rural') : t('calc.zone_urbain')}
        {membreCGA ? ` · ${lang === 'fr' ? 'Membre CGA' : 'CGA member'}` : ''}
      </p>

      {/* Tableau de breakdown */}
      <div className="bg-navy-mid/80 rounded-card border border-blue-electric/15 overflow-hidden mb-6">
        {/* Lignes de détail */}
        <div className="divide-y divide-navy-border">
          {rows.map(({ label, detail, value, sign }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3">
              <div>
                <span className="text-sm font-body text-text-secondary">{label}</span>
                <span className="text-xs text-text-muted ml-2">{detail}</span>
              </div>
              <span className={`font-display text-base font-semibold ${sign === '-' ? 'text-success' : sign === '+' ? 'text-gold' : 'text-text-primary'}`}>
                {sign === '-' ? '−' : sign === '+' ? '+' : ''}{formatFCFA(value)}
              </span>
            </div>
          ))}
        </div>

        {/* Ligne totale */}
        <div className="bg-blue-electric/8 border-t border-blue-electric/20 px-5 py-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-body font-700 text-text-secondary uppercase tracking-wider">
              {t('calc.total_annuel')}
            </span>
            <AnimatedAmount
              value={result.totalAnnuel}
              className="font-display text-2xl font-bold text-blue-glow"
            />
          </div>
          <div className="flex gap-6 text-sm font-body text-text-muted">
            <div>
              <span>{t('calc.trimestre')} : </span>
              <AnimatedAmount value={result.parTrimestre} className="font-semibold text-text-secondary" />
            </div>
            <div>
              <span>{t('calc.mois')} : </span>
              <AnimatedAmount value={result.parMois} className="font-semibold text-text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <Button variant="outline" size="sm" onClick={handleCopy}>
          {copied ? (
            <><Check className="w-4 h-4" aria-hidden="true" /> {t('calc.copied')}</>
          ) : (
            <><Copy className="w-4 h-4" aria-hidden="true" /> {t('calc.copy')}</>
          )}
        </Button>

        <Link href={`/${lang}/calendrier`}>
          <Button variant="ghost" size="sm">
            <Calendar className="w-4 h-4" aria-hidden="true" />
            {t('calc.see_calendar')}
          </Button>
        </Link>

        <Link href={`/${lang}/assistant`}>
          <Button variant="ghost" size="sm">
            <MessageCircle className="w-4 h-4" aria-hidden="true" />
            {t('calc.ask_ai')}
          </Button>
        </Link>
      </div>

      {/* Bouton nouveau calcul */}
      <Button variant="outline" onClick={onReset} className="w-full">
        <RefreshCcw className="w-4 h-4" aria-hidden="true" />
        {t('calc.recalculate')}
      </Button>

      {/* Avertissement légal */}
      <p className="text-xs text-text-muted mt-4 leading-relaxed text-center">
        ⚠️ {t('calc.disclaimer')}
      </p>
    </motion.div>
  );
}

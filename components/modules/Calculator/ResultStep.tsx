'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Copy, Check, Calendar, MessageCircle, RefreshCcw, TrendingDown, Sparkles } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { useFiscoStore } from '@/lib/store';
import type { IGSResult, Secteur, Zone } from '@/lib/fiscal-data-2026';
import { SECTEUR_INFO } from '@/lib/fiscal-data-2026';
import { formatFCFA, copierDansPressesPapier, formaterResultatIGS, calculerIGS } from '@/lib/utils';
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
  const { saveCalc } = useFiscoStore();
  const [copied, setCopied] = useState(false);

  // Sauvegarder le résultat dans le store (pour le dashboard)
  useEffect(() => {
    saveCalc({ ca: result.base / (result.taux / 100), secteur, zone, membreCGA, result, savedAt: Date.now() });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Simulation de comparaison CGA si l'utilisateur n'est pas membre
  const cgaSimulation = !membreCGA
    ? calculerIGS({ ca: result.base / (result.taux / 100), secteur, zone, membreCGA: true })
    : null;
  const cgaSavings = cgaSimulation ? result.totalAnnuel - cgaSimulation.totalAnnuel : 0;

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
      <div className="bg-navy-mid/80 rounded-card border border-blue-electric/15 overflow-hidden mb-5">
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

      {/* Encart suggestion CGA (si non-membre) */}
      {cgaSimulation && cgaSavings > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.35 }}
          className="mb-5 p-4 rounded-card border border-gold/30 bg-gold-soft"
        >
          <div className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" aria-hidden="true" />
            <div className="flex-1">
              <p className="text-sm font-body font-semibold text-text-primary mb-1">
                {lang === 'fr' ? '💡 Économie possible avec le CGA' : '💡 Potential saving with a CGA'}
              </p>
              <p className="text-xs text-text-secondary mb-2">
                {lang === 'fr'
                  ? `En adhérant à un Centre de Gestion Agréé (Art. C37 LF 2026), vous bénéficiez de -50% sur votre IGS.`
                  : `By joining an Approved Management Centre (Art. C37 FL 2026), you get -50% on your IGS.`}
              </p>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-success" aria-hidden="true" />
                  <span className="text-success font-semibold font-display">
                    {lang === 'fr' ? 'Vous économiseriez' : 'You would save'}{' '}
                    <AnimatedAmount value={cgaSavings} className="font-bold" />
                    {lang === 'fr' ? '/an' : '/year'}
                  </span>
                </div>
                <span className="text-text-muted">→</span>
                <span className="font-display font-semibold text-text-primary">
                  {formatFCFA(cgaSimulation.totalAnnuel)}
                  {lang === 'fr' ? '/an avec CGA' : '/year with CGA'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-5">
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

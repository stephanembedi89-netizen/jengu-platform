'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { IGS_BAREME, IGS_SEUIL_CA, type Secteur } from '@/lib/fiscal-data-2026';
import { formatFCFA } from '@/lib/utils';

interface CAStepProps {
  ca: number;
  secteur: Secteur;
  onChange: (ca: number) => void;
}

const MAX_SLIDER = 50_000_000;
const STEP = 500_000;

export default function CAStep({ ca, secteur, onChange }: CAStepProps) {
  const { t, locale } = useT();
  const [inputVal, setInputVal] = useState(ca > 0 ? ca.toString() : '');

  useEffect(() => {
    if (ca > 0) setInputVal(ca.toLocaleString('fr-FR'));
  }, [ca]);

  function handleInputChange(raw: string) {
    const cleaned = raw.replace(/\s/g, '').replace(/[^\d]/g, '');
    setInputVal(cleaned ? Number(cleaned).toLocaleString('fr-FR') : '');
    const val = parseInt(cleaned, 10) || 0;
    onChange(val);
  }

  function handleSlider(e: React.ChangeEvent<HTMLInputElement>) {
    const val = parseInt(e.target.value, 10);
    onChange(val);
  }

  // Trouver la tranche applicable
  const tranche = ca > 0 && ca < IGS_SEUIL_CA
    ? IGS_BAREME[secteur].find(t => ca >= t.min && ca < t.max)
    : null;

  const overLimit = ca >= IGS_SEUIL_CA;

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-text-primary mb-1">{t('calc.ca_label')}</h2>
      <p className="text-text-secondary text-sm mb-6">{t('calc.ca_hint')}</p>

      {/* Champ de saisie */}
      <div className="relative mb-4">
        <input
          type="text"
          value={inputVal}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder={t('calc.ca_placeholder')}
          aria-label={t('calc.ca_label')}
          className="input-field text-2xl font-display font-semibold pr-24 py-4"
          inputMode="numeric"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-body text-text-muted">
          FCFA
        </span>
      </div>

      {/* Slider */}
      <div className="mb-6">
        <input
          type="range"
          min={0}
          max={MAX_SLIDER}
          step={STEP}
          value={Math.min(ca, MAX_SLIDER)}
          onChange={handleSlider}
          aria-label="Slider chiffre d'affaires"
          className="w-full h-2 rounded-full accent-blue-electric cursor-pointer"
          style={{
            background: `linear-gradient(to right, #1a7fff ${(Math.min(ca, MAX_SLIDER) / MAX_SLIDER) * 100}%, #111e35 0%)`,
          }}
        />
        <div className="flex justify-between text-xs text-text-muted mt-1 font-body">
          <span>0</span>
          <span>25M</span>
          <span>50M FCFA</span>
        </div>
      </div>

      {/* Message dynamique */}
      {overLimit ? (
        <div className="flex gap-3 p-4 rounded-xl bg-danger-bg border border-danger/25">
          <AlertTriangle className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" aria-hidden="true" />
          <p className="text-sm text-danger">{t('calc.ca_limit_warning')}</p>
        </div>
      ) : tranche && ca > 0 ? (
        <div className="p-4 rounded-xl bg-blue-electric/8 border border-blue-electric/15">
          <p className="text-sm text-blue-glow font-body font-semibold">
            {t('calc.ca_tranche', {
              tranche: `${formatFCFA(tranche.min, { short: true })} – ${formatFCFA(tranche.max, { short: true })}`,
              taux: tranche.taux,
            })}
          </p>
          <p className="text-xs text-text-muted mt-1">
            {locale === 'fr'
              ? `Montant saisi : ${formatFCFA(ca)}`
              : `Amount entered: ${formatFCFA(ca)}`}
          </p>
        </div>
      ) : null}
    </div>
  );
}

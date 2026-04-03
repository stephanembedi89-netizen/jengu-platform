'use client';

import Link from 'next/link';
import { HelpCircle } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';
import Toggle from '@/components/ui/Toggle';
import type { Zone } from '@/lib/fiscal-data-2026';

interface ParamsStepProps {
  zone: Zone;
  membreCGA: boolean;
  onZoneChange: (zone: Zone) => void;
  onCGAChange: (cga: boolean) => void;
}

export default function ParamsStep({ zone, membreCGA, onZoneChange, onCGAChange }: ParamsStepProps) {
  const { t } = useT();
  const { locale } = useLangStore();

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-bold text-text-primary mb-6">
          {locale === 'fr' ? 'Paramètres additionnels' : 'Additional parameters'}
        </h2>

        {/* Zone géographique */}
        <div className="mb-8">
          <label className="block text-sm font-body font-semibold text-text-secondary mb-3">
            {t('calc.zone_label')}
          </label>
          <div className="flex gap-3">
            {(['urbain', 'rural'] as Zone[]).map((z) => (
              <button
                key={z}
                onClick={() => onZoneChange(z)}
                aria-pressed={zone === z}
                className={cn(
                  'flex-1 flex flex-col items-center gap-2 p-4 rounded-card border transition-all duration-200',
                  zone === z
                    ? 'bg-blue-electric/10 border-blue-electric/40 text-blue-glow'
                    : 'bg-navy-card/60 border-navy-border text-text-secondary hover:border-blue-electric/25'
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {z === 'urbain' ? '🏙️' : '🌿'}
                </span>
                <span className="text-sm font-body font-semibold">
                  {z === 'urbain' ? t('calc.zone_urbain') : t('calc.zone_rural')}
                </span>
                {z === 'rural' && (
                  <span className="text-[10px] font-body text-gold">{t('calc.zone_rural_hint')}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Statut CGA */}
        <div className="p-5 rounded-card bg-navy-card border border-navy-border">
          <Toggle
            id="cga-toggle"
            checked={membreCGA}
            onChange={onCGAChange}
            label={t('calc.cga_label')}
            hint={t('calc.cga_hint')}
          />

          {membreCGA && (
            <div className="mt-3 p-3 rounded-xl bg-success-bg border border-success/20">
              <p className="text-xs text-success font-body font-semibold">
                ✓ {locale === 'fr'
                  ? 'Abattement CGA de 50% appliqué sur votre estimation.'
                  : '50% CGA reduction applied to your estimate.'}
              </p>
            </div>
          )}

          <Link
            href={`/${locale}/faq`}
            className="inline-flex items-center gap-1 mt-3 text-xs text-blue-glow hover:text-blue-electric transition-colors font-body"
          >
            <HelpCircle className="w-3 h-3" aria-hidden="true" />
            {t('calc.cga_link')}
          </Link>
        </div>
      </div>
    </div>
  );
}

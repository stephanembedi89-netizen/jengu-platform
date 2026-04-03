'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { SECTEUR_INFO, type Secteur } from '@/lib/fiscal-data-2026';
import { cn } from '@/lib/utils';

interface SectorStepProps {
  selected: Secteur | null;
  onChange: (secteur: Secteur) => void;
}

const secteurs: Secteur[] = ['commerce', 'services', 'artisanat', 'liberal'];

export default function SectorStep({ selected, onChange }: SectorStepProps) {
  const { t, locale } = useT();

  return (
    <div>
      <h2 className="font-display text-2xl font-bold text-text-primary mb-1">{t('calc.sector_label')}</h2>
      <p className="text-text-secondary text-sm mb-6">{t('calc.sector_hint')}</p>

      <div className="grid sm:grid-cols-2 gap-3">
        {secteurs.map((secteur, i) => {
          const info = SECTEUR_INFO[secteur];
          const label = locale === 'en' ? info.label_en : info.label_fr;
          const exemples = locale === 'en' ? info.exemples_en : info.exemples_fr;
          const isSelected = selected === secteur;

          return (
            <motion.button
              key={secteur}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.3 }}
              onClick={() => onChange(secteur)}
              aria-pressed={isSelected}
              className={cn(
                'relative text-left p-5 rounded-card border transition-all duration-200 group',
                isSelected
                  ? 'bg-blue-electric/10 border-blue-electric/40 shadow-[0_0_0_1px_rgba(26,127,255,0.3)]'
                  : 'bg-navy-card/60 border-navy-border hover:border-blue-electric/25 hover:bg-navy-card'
              )}
            >
              {/* Checkmark */}
              {isSelected && (
                <span className="absolute top-3 right-3 w-5 h-5 rounded-full bg-blue-electric flex items-center justify-center">
                  <Check className="w-3 h-3 text-white" aria-hidden="true" />
                </span>
              )}

              {/* Icône */}
              <span className="text-3xl mb-3 block" aria-hidden="true">{info.icon}</span>

              {/* Titre */}
              <h3 className={cn(
                'font-display text-lg font-semibold mb-1',
                isSelected ? 'text-blue-glow' : 'text-text-primary'
              )}>
                {label}
              </h3>

              {/* Exemples */}
              <p className="text-xs text-text-muted leading-relaxed">{exemples}</p>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

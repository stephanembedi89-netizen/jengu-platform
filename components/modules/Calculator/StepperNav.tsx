'use client';

import { Check } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

interface StepperNavProps {
  currentStep: number;
  totalSteps: number;
}

export default function StepperNav({ currentStep, totalSteps }: StepperNavProps) {
  const { t } = useT();
  const steps = [t('calc.step1'), t('calc.step2'), t('calc.step3'), t('calc.step4')];

  return (
    <div className="flex items-center gap-0" role="list" aria-label="Étapes du calculateur">
      {steps.map((label, i) => {
        const step = i + 1;
        const done = step < currentStep;
        const active = step === currentStep;

        return (
          <div key={label} className="flex items-center flex-1 last:flex-none" role="listitem">
            <div className="flex flex-col items-center gap-1">
              {/* Cercle */}
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-body font-semibold transition-all duration-250',
                  done   && 'bg-success text-white',
                  active && 'bg-blue-electric text-white ring-4 ring-blue-electric/20',
                  !done && !active && 'bg-navy-border text-text-muted'
                )}
                aria-current={active ? 'step' : undefined}
              >
                {done ? <Check className="w-4 h-4" aria-hidden="true" /> : step}
              </div>
              {/* Label */}
              <span className={cn(
                'text-[10px] font-body font-semibold uppercase tracking-wider hidden sm:block whitespace-nowrap',
                active ? 'text-blue-glow' : 'text-text-muted'
              )}>
                {label}
              </span>
            </div>

            {/* Connecteur */}
            {i < totalSteps - 1 && (
              <div className={cn(
                'flex-1 h-0.5 mx-2 transition-colors duration-250',
                done ? 'bg-success' : 'bg-navy-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

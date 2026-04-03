'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useT } from '@/lib/i18n/useTranslation';
import { calculerIGS } from '@/lib/utils';
import type { Secteur, Zone, IGSResult } from '@/lib/fiscal-data-2026';
import { IGS_SEUIL_CA } from '@/lib/fiscal-data-2026';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import StepperNav from '@/components/modules/Calculator/StepperNav';
import SectorStep from '@/components/modules/Calculator/SectorStep';
import CAStep from '@/components/modules/Calculator/CAStep';
import ParamsStep from '@/components/modules/Calculator/ParamsStep';
import ResultStep from '@/components/modules/Calculator/ResultStep';

const TOTAL_STEPS = 4;

export default function CalculateurPage() {
  const { t, locale } = useT();

  // État du formulaire
  const [step, setStep] = useState(1);
  const [secteur, setSecteur] = useState<Secteur | null>(null);
  const [ca, setCA] = useState(0);
  const [zone, setZone] = useState<Zone>('urbain');
  const [membreCGA, setMembreCGA] = useState(false);
  const [result, setResult] = useState<IGSResult | null>(null);

  // Validation par étape
  function canProceed() {
    if (step === 1) return secteur !== null;
    if (step === 2) return ca > 0 && ca < IGS_SEUIL_CA;
    if (step === 3) return true;
    return false;
  }

  function handleNext() {
    if (step === 3) {
      // Calculer le résultat
      const res = calculerIGS({ ca, secteur: secteur!, zone, membreCGA });
      setResult(res);
      setStep(4);
    } else {
      setStep((s) => s + 1);
    }
  }

  function handlePrev() {
    setStep((s) => s - 1);
  }

  function handleReset() {
    setSecteur(null);
    setCA(0);
    setZone('urbain');
    setMembreCGA(false);
    setResult(null);
    setStep(1);
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* En-tête */}
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-text-primary mb-2">
          {t('calc.title')}
        </h1>
        <p className="text-text-secondary">{t('calc.subtitle')}</p>
      </div>

      <Card padding="lg">
        {/* Stepper */}
        <div className="mb-8">
          <StepperNav currentStep={step} totalSteps={TOTAL_STEPS} />
        </div>

        {/* Contenu par étape */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            {step === 1 && (
              <SectorStep
                selected={secteur}
                onChange={setSecteur}
              />
            )}
            {step === 2 && secteur && (
              <CAStep
                ca={ca}
                secteur={secteur}
                onChange={setCA}
              />
            )}
            {step === 3 && (
              <ParamsStep
                zone={zone}
                membreCGA={membreCGA}
                onZoneChange={setZone}
                onCGAChange={setMembreCGA}
              />
            )}
            {step === 4 && result && secteur && (
              <ResultStep
                result={result}
                secteur={secteur}
                zone={zone}
                membreCGA={membreCGA}
                onReset={handleReset}
              />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation (cachée à l'étape 4) */}
        {step < 4 && (
          <div className="flex justify-between mt-8 pt-6 border-t border-navy-border">
            <Button
              variant="outline"
              onClick={handlePrev}
              disabled={step === 1}
              size="md"
            >
              ← {t('calc.prev')}
            </Button>
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              size="md"
            >
              {step === 3
                ? (locale === 'fr' ? 'Calculer →' : 'Calculate →')
                : `${t('calc.next')} →`}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

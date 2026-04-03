'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ExternalLink, AlertTriangle, FileText, UserCheck } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { DISCLAIMER_KEY, IMPOTS_CM_URL, ONECCA_URL } from '@/lib/constants';
import Button from './Button';

export default function Disclaimer() {
  const { t } = useT();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem(DISCLAIMER_KEY);
    if (!seen) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(DISCLAIMER_KEY, '1');
    setVisible(false);
  }

  const points = [
    { icon: AlertTriangle, titleKey: 'disclaimer.p1.title', descKey: 'disclaimer.p1.desc', color: 'text-gold' },
    { icon: Shield, titleKey: 'disclaimer.p2.title', descKey: 'disclaimer.p2.desc', color: 'text-blue-glow' },
    { icon: ExternalLink, titleKey: 'disclaimer.p3.title', descKey: 'disclaimer.p3.desc', color: 'text-blue-glow' },
    { icon: UserCheck, titleKey: 'disclaimer.p4.title', descKey: 'disclaimer.p4.desc', color: 'text-success' },
  ];

  return (
    <AnimatePresence>
      {visible && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-navy-deep/90 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="disclaimer-title"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-md bg-navy-card border border-gold/30 rounded-card p-7 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
              {/* En-tête */}
              <div className="text-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gold-soft border border-gold/30 flex items-center justify-center mx-auto mb-3">
                  <FileText className="w-6 h-6 text-gold" />
                </div>
                <h2 id="disclaimer-title" className="font-display text-xl font-bold text-text-primary">
                  {t('disclaimer.title')}
                </h2>
                <p className="text-sm text-text-muted mt-1">{t('disclaimer.subtitle')}</p>
              </div>

              {/* 4 points */}
              <div className="space-y-3 mb-6">
                {points.map(({ icon: Icon, titleKey, descKey, color }) => (
                  <div key={titleKey} className="flex gap-3 p-3 rounded-xl bg-navy-mid/60 border border-navy-border">
                    <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${color}`} />
                    <div>
                      <p className="text-xs font-body font-semibold text-text-primary">{t(titleKey)}</p>
                      <p className="text-xs text-text-muted mt-0.5 leading-relaxed">{t(descKey)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <Button onClick={accept} className="w-full" size="lg">
                {t('disclaimer.cta')}
              </Button>

              {/* Liens utiles */}
              <div className="flex justify-center gap-4 mt-3 text-xs text-text-muted">
                <a
                  href={IMPOTS_CM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-glow transition-colors"
                >
                  impots.cm ↗
                </a>
                <span>·</span>
                <a
                  href={ONECCA_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-blue-glow transition-colors"
                >
                  ONECCA ↗
                </a>
              </div>

              {/* Signature Jengu.AI */}
              <p className="text-center text-[11px] text-text-muted mt-4 pt-4 border-t border-navy-border">
                {t('disclaimer.signature')}
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

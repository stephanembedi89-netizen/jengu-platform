'use client';

import { usePathname } from 'next/navigation';
import { ExternalLink } from 'lucide-react';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useT } from '@/lib/i18n/useTranslation';
import { IMPOTS_CM_URL } from '@/lib/constants';

const PAGE_LABELS: Record<string, { fr: string; en: string }> = {
  dashboard:   { fr: 'Tableau de bord', en: 'Dashboard' },
  calculateur: { fr: 'Calculateur IGS', en: 'IGS Calculator' },
  calendrier:  { fr: 'Calendrier fiscal', en: 'Fiscal Calendar' },
  assistant:   { fr: 'Assistant IA', en: 'AI Assistant' },
  faq:         { fr: 'FAQ fiscale', en: 'Tax FAQ' },
  legal:       { fr: 'Cadre légal', en: 'Legal Framework' },
};

export default function Header() {
  const { t, locale } = useT();
  const pathname = usePathname();

  // Extraire la page actuelle depuis le pathname
  const segments = pathname.split('/').filter(Boolean);
  const pageKey = segments[segments.length - 1] || 'dashboard';
  const pageLabel = PAGE_LABELS[pageKey]?.[locale] || pageKey;

  return (
    <header className="h-14 border-b border-white/[0.07] bg-navy-mid/80 backdrop-blur-lg sticky top-0 z-20 flex items-center px-5 gap-3">
      {/* Page title */}
      <div className="flex-1 flex items-center gap-2 min-w-0">
        <span className="text-[13px] font-body font-semibold text-text-primary truncate">
          {pageLabel}
        </span>
      </div>

      {/* Live badge */}
      <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill text-[11px] font-body font-semibold bg-blue-electric/10 text-blue-glow border border-blue-electric/14 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-blue-electric animate-pulse flex-shrink-0" />
        {t('app.date_badge')}
      </span>

      {/* impots.cm */}
      <a
        href={IMPOTS_CM_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-body text-text-muted hover:text-blue-glow hover:bg-white/[0.05] transition-all"
        aria-label="Aller sur impots.cm"
      >
        <ExternalLink className="w-3 h-3" aria-hidden="true" />
        impots.cm
      </a>

      {/* Toggle FR/EN */}
      <LanguageToggle />
    </header>
  );
}

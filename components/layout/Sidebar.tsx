'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calculator, Calendar, MessageCircle,
  HelpCircle, Scale, ExternalLink
} from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';
import { IMPOTS_CM_URL, ONECCA_URL } from '@/lib/constants';

const NAV_ITEMS = [
  { key: 'dashboard',   icon: LayoutDashboard, labelKey: 'nav.dashboard' },
  { key: 'calculateur', icon: Calculator,       labelKey: 'nav.calculateur' },
  { key: 'calendrier',  icon: Calendar,         labelKey: 'nav.calendrier' },
  { key: 'assistant',   icon: MessageCircle,    labelKey: 'nav.assistant' },
  { key: 'faq',         icon: HelpCircle,       labelKey: 'nav.faq' },
  { key: 'legal',       icon: Scale,            labelKey: 'nav.legal' },
] as const;

export default function Sidebar() {
  const { t } = useT();
  const { locale } = useLangStore();
  const pathname = usePathname();

  function isActive(key: string) {
    return pathname.includes(`/${key}`);
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-navy-mid border-r border-navy-border fixed left-0 top-0 bottom-0 z-30">
      {/* Logo + Branding */}
      <div className="p-6 border-b border-navy-border">
        <Link href="/" className="block">
          <h1 className="font-display text-2xl font-bold text-text-primary tracking-tight">
            Fisco.IA
          </h1>
        </Link>
        {/* Badge "by Jengu.AI" — discret */}
        <a
          href="https://jengu.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-[10px] font-body text-blue-glow/70 border border-blue-electric/20 bg-blue-electric/[0.08] hover:text-blue-glow transition-colors"
          aria-label="Visiter jengu.ai"
        >
          by Jengu.AI
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ key, icon: Icon, labelKey }) => {
          const active = isActive(key);
          return (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-body font-medium transition-all duration-150 group relative',
                active
                  ? 'bg-blue-electric/10 text-blue-glow border border-blue-electric/15'
                  : 'text-text-secondary hover:bg-navy-border/50 hover:text-text-primary'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Barre active gauche */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-blue-electric rounded-r-full" />
              )}
              <Icon
                className={cn('w-4 h-4 flex-shrink-0', active ? 'text-blue-electric' : 'text-text-muted group-hover:text-text-secondary')}
                aria-hidden="true"
              />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* Liens externes en bas */}
      <div className="px-3 pb-4 space-y-1 border-t border-navy-border pt-3">
        <a
          href={IMPOTS_CM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body text-text-muted hover:text-blue-glow hover:bg-navy-border/30 transition-all"
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          impots.cm
        </a>
        <a
          href={ONECCA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body text-text-muted hover:text-blue-glow hover:bg-navy-border/30 transition-all"
        >
          <ExternalLink className="w-3 h-3" aria-hidden="true" />
          ONECCA
        </a>
      </div>
    </aside>
  );
}

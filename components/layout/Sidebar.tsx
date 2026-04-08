'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Calculator, Calendar, MessageCircle,
  HelpCircle, Scale, ExternalLink, CreditCard
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
  { key: 'tarifs',      icon: CreditCard,       labelKey: 'nav.tarifs' },
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
    <aside className="hidden lg:flex flex-col w-60 min-h-screen fixed left-0 top-0 bottom-0 z-30 bg-navy-mid/90 backdrop-blur-lg border-r border-white/[0.07]">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/[0.07]">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-electric to-[#1a5fcc] flex items-center justify-center shadow-blue flex-shrink-0">
            <span className="text-white text-sm font-display font-bold">F</span>
          </div>
          <span className="font-display text-lg font-bold text-text-primary tracking-tight">Fisco.IA</span>
        </Link>
        <a
          href="https://jengu.ai"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 mt-2 px-2 py-0.5 rounded-pill text-[10px] font-body text-blue-glow/60 border border-blue-electric/15 bg-blue-electric/[0.06] hover:text-blue-glow hover:border-blue-electric/30 transition-all"
        >
          by Jengu.AI
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5" aria-label="Navigation principale">
        {NAV_ITEMS.map(({ key, icon: Icon, labelKey }) => {
          const active = isActive(key);
          return (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-body font-medium transition-all duration-150 group relative',
                active
                  ? 'bg-blue-electric/10 text-text-primary border border-blue-electric/14'
                  : 'text-text-secondary hover:bg-white/[0.04] hover:text-text-primary border border-transparent'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {/* Left accent bar */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-blue-electric rounded-r-full shadow-[0_0_6px_rgba(45,127,249,0.6)]" />
              )}
              <Icon
                className={cn(
                  'w-4 h-4 flex-shrink-0 transition-colors',
                  active ? 'text-blue-electric' : 'text-text-muted group-hover:text-text-secondary'
                )}
                aria-hidden="true"
              />
              {t(labelKey)}
            </Link>
          );
        })}
      </nav>

      {/* External links */}
      <div className="px-3 pb-4 pt-3 border-t border-white/[0.07] space-y-0.5">
        {[
          { href: IMPOTS_CM_URL, label: 'impots.cm' },
          { href: ONECCA_URL,    label: 'ONECCA' },
        ].map(({ href, label }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-body text-text-muted hover:text-blue-glow hover:bg-white/[0.04] transition-all"
          >
            <ExternalLink className="w-3 h-3 flex-shrink-0" aria-hidden="true" />
            {label}
          </a>
        ))}
      </div>
    </aside>
  );
}

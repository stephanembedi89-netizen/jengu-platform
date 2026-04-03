'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calculator, MessageCircle, Calendar, MoreHorizontal } from 'lucide-react';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

const BOTTOM_ITEMS = [
  { key: 'dashboard',   icon: LayoutDashboard, labelFr: 'Accueil',      labelEn: 'Home' },
  { key: 'calculateur', icon: Calculator,       labelFr: 'Calcul',       labelEn: 'Calculate' },
  { key: 'assistant',   icon: MessageCircle,    labelFr: 'Assistant',    labelEn: 'Assistant' },
  { key: 'calendrier',  icon: Calendar,         labelFr: 'Calendrier',   labelEn: 'Calendar' },
  { key: 'faq',         icon: MoreHorizontal,   labelFr: 'Plus',         labelEn: 'More' },
] as const;

export default function BottomNav() {
  const { locale } = useLangStore();
  const pathname = usePathname();

  function isActive(key: string) {
    return pathname.includes(`/${key}`);
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 h-16 bg-navy-mid/90 backdrop-blur-xl border-t border-navy-border"
      aria-label="Navigation mobile"
    >
      <div className="flex h-full">
        {BOTTOM_ITEMS.map(({ key, icon: Icon, labelFr, labelEn }) => {
          const active = isActive(key);
          const label = locale === 'en' ? labelEn : labelFr;

          return (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 transition-all duration-150',
                active ? 'text-blue-electric' : 'text-text-muted hover:text-text-secondary'
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              <Icon
                className={cn('w-5 h-5', active && 'scale-110')}
                aria-hidden="true"
              />
              <span className="text-[10px] font-body font-semibold tracking-wide">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

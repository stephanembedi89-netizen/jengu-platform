'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Calculator, MessageCircle, Calendar, MoreHorizontal } from 'lucide-react';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

const BOTTOM_ITEMS = [
  { key: 'dashboard',   icon: LayoutDashboard, labelFr: 'Accueil',   labelEn: 'Home' },
  { key: 'calculateur', icon: Calculator,       labelFr: 'Calcul',    labelEn: 'Calculate' },
  { key: 'assistant',   icon: MessageCircle,    labelFr: 'IA',        labelEn: 'AI' },
  { key: 'calendrier',  icon: Calendar,         labelFr: 'Dates',     labelEn: 'Calendar' },
  { key: 'faq',         icon: MoreHorizontal,   labelFr: 'Plus',      labelEn: 'More' },
] as const;

export default function BottomNav() {
  const { locale } = useLangStore();
  const pathname = usePathname();

  function isActive(key: string) {
    return pathname.includes(`/${key}`);
  }

  return (
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-30 pb-safe bg-navy-mid/85 backdrop-blur-lg border-t border-white/[0.07] shadow-[0_-8px_32px_rgba(0,0,0,0.35)]"
      aria-label="Navigation mobile"
    >
      <div className="flex h-[58px]">
        {BOTTOM_ITEMS.map(({ key, icon: Icon, labelFr, labelEn }) => {
          const active = isActive(key);
          const label = locale === 'en' ? labelEn : labelFr;

          return (
            <Link
              key={key}
              href={`/${locale}/${key}`}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-0.5 relative',
                'transition-colors duration-150',
                active ? 'text-blue-electric' : 'text-text-muted hover:text-text-secondary'
              )}
              aria-current={active ? 'page' : undefined}
              aria-label={label}
            >
              {/* Top active pill */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-b-full bg-blue-electric shadow-[0_0_8px_rgba(45,127,249,0.7)]" />
              )}

              {/* Icon with bg pill when active */}
              <span
                className={cn(
                  'flex items-center justify-center w-9 h-7 rounded-xl',
                  'transition-all duration-200',
                  active ? 'bg-blue-electric/12 scale-110' : 'scale-100'
                )}
              >
                <Icon className="w-[18px] h-[18px]" aria-hidden="true" />
              </span>

              <span className={cn(
                'text-[10px] font-body font-semibold tracking-wide',
                active ? 'text-blue-electric' : 'text-text-muted'
              )}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

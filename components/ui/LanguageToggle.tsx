'use client';

import { useLangStore } from '@/lib/i18n/useTranslation';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
  const { locale, setLocale } = useLangStore();

  return (
    <div
      role="group"
      aria-label="Language / Langue"
      className="flex items-center bg-navy-border/50 rounded-full p-0.5 border border-navy-border"
    >
      {(['fr', 'en'] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLocale(lang)}
          aria-label={lang === 'fr' ? 'Français' : 'English'}
          aria-pressed={locale === lang}
          className={cn(
            'px-3 py-1 rounded-full text-xs font-body font-700 uppercase tracking-wider transition-all duration-150',
            locale === lang
              ? 'bg-blue-electric text-white shadow-sm'
              : 'text-text-muted hover:text-text-secondary'
          )}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}

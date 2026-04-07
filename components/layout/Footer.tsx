'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { COMPANY_URL } from '@/lib/constants';

export default function Footer() {
  const { t } = useT();
  const { locale } = useLangStore();

  return (
    <footer className="border-t border-white/[0.06] bg-navy-mid/40 mt-auto">
      <div className="px-5 py-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[12px] font-body text-text-muted">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-text-secondary">Fisco.IA</span>
          <span>·</span>
          <a href={COMPANY_URL} target="_blank" rel="noopener noreferrer" className="hover:text-blue-glow transition-colors">
            Jengu.AI
          </a>
          <span>·</span>
          <span>Douala 🇨🇲</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">{t('footer.legal')}</Link>
          <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">{t('footer.cgu')}</Link>
        </div>
        <span className="ml-auto hidden sm:block">© 2026 Jengu.AI</span>
      </div>
      <div className="px-5 py-2 border-t border-white/[0.04] text-[11px] text-text-muted/70 text-center leading-relaxed">
        {t('footer.disclaimer')}
      </div>
    </footer>
  );
}

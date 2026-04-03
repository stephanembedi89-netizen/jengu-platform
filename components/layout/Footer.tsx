'use client';

import Link from 'next/link';
import { useT } from '@/lib/i18n/useTranslation';
import { useLangStore } from '@/lib/i18n/useTranslation';
import { COMPANY_URL } from '@/lib/constants';

export default function Footer() {
  const { t } = useT();
  const { locale } = useLangStore();

  return (
    <footer className="border-t border-navy-border bg-navy-mid/60 mt-auto">
      <div className="px-6 py-4 flex flex-col sm:flex-row items-center gap-3 text-xs font-body text-text-muted">
        {/* Signature Jengu.AI */}
        <div className="flex items-center gap-1.5">
          <span className="text-text-primary font-semibold">Fisco.IA</span>
          <span>·</span>
          <a
            href={COMPANY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-blue-glow transition-colors"
          >
            Jengu.AI
          </a>
          <span>·</span>
          <span>Douala, Cameroun 🇨🇲</span>
        </div>

        <span className="hidden sm:block">—</span>

        {/* Liens légaux */}
        <div className="flex items-center gap-3">
          <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">
            {t('footer.legal')}
          </Link>
          <span>·</span>
          <Link href={`/${locale}/legal`} className="hover:text-text-secondary transition-colors">
            {t('footer.cgu')}
          </Link>
        </div>

        <span className="hidden sm:block ml-auto">© 2026 Jengu.AI. {t('footer.rights')}</span>
      </div>

      {/* Avertissement légal */}
      <div className="px-6 py-2 border-t border-navy-border/50 text-[11px] text-text-muted text-center">
        {t('footer.disclaimer')}
      </div>
    </footer>
  );
}

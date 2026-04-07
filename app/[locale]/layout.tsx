import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { locales, type Locale } from '@/lib/i18n/config';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import BottomNav from '@/components/layout/BottomNav';
import Footer from '@/components/layout/Footer';
import Disclaimer from '@/components/ui/Disclaimer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params: { locale } }: LocaleLayoutProps) {
  // Valider la locale
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  // Activer le rendu statique pour next-intl
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <div className="min-h-screen bg-navy-deep">
        {/* Disclaimer modal — premier chargement */}
        <Disclaimer />

        {/* Sidebar desktop */}
        <Sidebar />

        {/* Zone principale */}
        <div className="lg:ml-60 flex flex-col min-h-screen">
          <Header />

          <main className="flex-1 p-4 sm:p-6 pb-20 lg:pb-6" id="main-content">
            {children}
          </main>

          <Footer />
        </div>

        {/* Bottom nav mobile */}
        <BottomNav />
      </div>
    </NextIntlClientProvider>
  );
}

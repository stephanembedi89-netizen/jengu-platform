import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fisco.IA · by Jengu.AI',
    template: '%s · Fisco.IA',
  },
  description:
    'Calculateur IGS, calendrier fiscal 2026 et assistant IA pour TPE/PME camerounaises. Conforme Loi de Finances 2026.',
  authors: [{ name: 'Jengu.AI', url: 'https://jengu.ai' }],
  creator: 'Jengu.AI — Douala, Cameroun',
  keywords: [
    'IGS Cameroun 2026', 'calculateur IGS', 'fiscalité Cameroun PME',
    'impôts TPE Cameroun', 'LF 2026', 'DGI Cameroun', 'Jengu.AI',
    'déclaration fiscale Cameroun', 'barème IGS', 'CGA Cameroun',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Fisco.IA',
  },
  openGraph: {
    siteName: 'Fisco.IA by Jengu.AI',
    locale: 'fr_CM',
    type: 'website',
    title: 'Fisco.IA — Fiscalité PME Cameroun 2026',
    description: 'Calculez votre IGS, consultez le calendrier fiscal et posez vos questions fiscales à notre IA. 100% LF 2026.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fisco.IA by Jengu.AI',
    description: 'Votre assistant fiscal IA pour les PME camerounaises — LF 2026',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: '#1a7fff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Sora:wght@600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fisco.IA · by Jengu.AI',
    template: '%s · Fisco.IA',
  },
  description:
    'Calculateur IGS, calendrier fiscal et assistant IA pour TPE/PME camerounaises. Basé sur la Loi de Finances 2026.',
  authors: [{ name: 'Jengu.AI', url: 'https://jengu.ai' }],
  creator: 'Jengu.AI — Douala, Cameroun',
  keywords: ['IGS', 'fiscalité Cameroun', 'impôts PME', 'LF 2026', 'DGI Cameroun', 'Jengu.AI'],
  openGraph: {
    siteName: 'Fisco.IA by Jengu.AI',
    locale: 'fr_CM',
    type: 'website',
  },
  other: {
    author: 'Jengu.AI',
    creator: 'Jengu.AI — Douala, Cameroun',
  },
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
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}

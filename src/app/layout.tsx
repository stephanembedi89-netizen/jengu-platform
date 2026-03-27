import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jengu.AI — Intelligence Artificielle pour les Entreprises',
  description:
    "Jengu.AI est votre partenaire stratégique en IA : conseil, automatisation, annotation de données et formation pour transformer votre entreprise.",
  keywords: ['Intelligence Artificielle', 'IA', 'Automatisation', 'Annotation', 'Formation IA', 'Conseil IA'],
  openGraph: {
    title: 'Jengu.AI — Intelligence Artificielle pour les Entreprises',
    description: "Conseil, Automatisation, Annotation & Formation IA.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="antialiased">
        <Navbar />
        <main className="page-wrapper">{children}</main>
        <Footer />
      </body>
    </html>
  )
}

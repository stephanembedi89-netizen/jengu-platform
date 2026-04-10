import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: { default: 'JenguAssur', template: '%s | JenguAssur' },
  description: 'Plateforme SaaS de gestion commerciale pour compagnies d\'assurance à Douala',
  keywords: ['assurance', 'Douala', 'Cameroun', 'CIMA', 'gestion sinistres', 'pipeline commercial'],
  authors: [{ name: 'Jengu.AI' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'JenguAssur',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0f1e',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className="dark">
      <body className="min-h-screen bg-[#0a0f1e]">
        {children}
      </body>
    </html>
  )
}

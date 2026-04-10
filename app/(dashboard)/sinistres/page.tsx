import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import SinistresClient from './SinistresClient'

export const metadata = { title: 'Sinistres' }

export default async function SinistresPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const [sinistres, agents, contrats] = await Promise.all([
    prisma.sinistre.findMany({
      where: { tenantId: session.tenantId },
      include: {
        contrat: { select: { numero: true, nomAssure: true, typeProduit: true } },
        agent: { select: { nom: true, prenom: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    }),
    prisma.agent.findMany({ where: { tenantId: session.tenantId, isActif: true }, select: { id: true, nom: true, prenom: true } }),
    prisma.contrat.findMany({ where: { tenantId: session.tenantId, statut: 'ACTIF' }, select: { id: true, numero: true, nomAssure: true }, orderBy: { createdAt: 'desc' }, take: 200 }),
  ])

  return <SinistresClient sinistres={sinistres} agents={agents} contrats={contrats} role={session.role} />
}

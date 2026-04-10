import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ContratsClient from './ContratsClient'

export const metadata = { title: 'Contrats' }

export default async function ContratsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const agents = await prisma.agent.findMany({
    where: { tenantId: session.tenantId, isActif: true },
    select: { id: true, nom: true, prenom: true },
    orderBy: { nom: 'asc' },
  })

  const contrats = await prisma.contrat.findMany({
    where: { tenantId: session.tenantId },
    include: { agent: { select: { nom: true, prenom: true } }, produit: { select: { nom: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return <ContratsClient agents={agents} initialContrats={contrats} role={session.role} />
}

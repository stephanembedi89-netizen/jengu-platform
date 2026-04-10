import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import ProspectsClient from './ProspectsClient'

export const metadata = { title: 'Prospects' }

export default async function ProspectsPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const agents = await prisma.agent.findMany({
    where: { tenantId: session.tenantId, isActif: true },
    select: { id: true, nom: true, prenom: true, zone: true },
    orderBy: { nom: 'asc' },
  })

  const prospects = await prisma.prospect.findMany({
    where: { tenantId: session.tenantId },
    include: { agent: { select: { nom: true, prenom: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return <ProspectsClient agents={agents} initialProspects={prospects} role={session.role} />
}

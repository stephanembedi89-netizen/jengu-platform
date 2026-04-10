import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import AgentsClient from './AgentsClient'

export const metadata = { title: 'Agents' }

export default async function AgentsPage() {
  const session = await getSession()
  if (!session) redirect('/login')
  if (!['ADMIN', 'SUPERVISEUR'].includes(session.role)) redirect('/dashboard')

  const debutMois = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const agents = await prisma.agent.findMany({
    where: { tenantId: session.tenantId },
    include: { _count: { select: { contrats: true, prospects: true } } },
    orderBy: { nom: 'asc' },
  })

  const agentsWithCA = await Promise.all(agents.map(async (agent) => {
    const agg = await prisma.contrat.aggregate({
      where: { agentId: agent.id, createdAt: { gte: debutMois } },
      _sum: { primeAnnuelle: true, commission: true },
    })
    return { ...agent, caThisMth: agg._sum.primeAnnuelle ?? 0, commissionThisMth: agg._sum.commission ?? 0 }
  }))

  return <AgentsClient agents={agentsWithCA} />
}

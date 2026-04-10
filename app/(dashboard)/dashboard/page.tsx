import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { startOfMonth } from 'date-fns'
import { DAYS_30_MS } from '@/lib/utils'
import DashboardClient from './DashboardClient'

export const metadata = { title: 'Tableau de bord' }

export default async function DashboardPage() {
  const session = await getSession()
  if (!session) redirect('/login')

  const tenantId = session.tenantId
  const now = new Date()
  const debutMois = startOfMonth(now)
  const echeanceLte = new Date(now.getTime() + DAYS_30_MS)

  const [
    contratsActifs,
    totalProspects,
    sinistresOuverts,
    echeances30j,
    activitesRecentes,
    topAgents,
    caAgg,
    prospectsParStatut,
  ] = await Promise.all([
    prisma.contrat.count({ where: { tenantId, statut: 'ACTIF' } }),
    prisma.prospect.count({ where: { tenantId } }),
    prisma.sinistre.count({ where: { tenantId, statut: { notIn: ['INDEMNISE', 'REJETE', 'CLOS'] } } }),
    prisma.contrat.count({
      where: { tenantId, statut: 'ACTIF', dateEcheance: { gte: now, lte: echeanceLte } },
    }),
    prisma.activite.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
      take: 8,
      include: {
        agent: { select: { nom: true, prenom: true } },
        prospect: { select: { nom: true, prenom: true } },
      },
    }),
    prisma.agent.findMany({
      where: { tenantId, isActif: true },
      include: { _count: { select: { contrats: true, prospects: true } } },
      orderBy: { contrats: { _count: 'desc' } },
      take: 5,
    }),
    prisma.contrat.aggregate({
      where: { tenantId, createdAt: { gte: debutMois } },
      _sum: { primeAnnuelle: true },
    }),
    prisma.prospect.groupBy({
      by: ['statut'],
      where: { tenantId },
      _count: true,
    }),
  ])

  const caThisMth = caAgg._sum.primeAnnuelle ?? 0

  return (
    <DashboardClient
      stats={{ contratsActifs, totalProspects, sinistresOuverts, echeances30j, caThisMth }}
      activites={activitesRecentes}
      topAgents={topAgents}
      prospectsParStatut={prospectsParStatut}
      role={session.role}
    />
  )
}

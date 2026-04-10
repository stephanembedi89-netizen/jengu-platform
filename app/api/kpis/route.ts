import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const tenantId = session.tenantId
  const now = new Date()
  const startThisMonth = startOfMonth(now)
  const endThisMonth = endOfMonth(now)
  const startLastMonth = startOfMonth(subMonths(now, 1))
  const endLastMonth = endOfMonth(subMonths(now, 1))

  const [
    totalContrats, contratsActifs, contratsThisMth, contratsLastMth,
    totalProspects, prospectsConvertisMth, prospectsThisMth,
    sinistresOuverts, sinistresThisMth,
    primesThisMth, primesLastMth,
    echeances30j, agentsActifs,
  ] = await Promise.all([
    prisma.contrat.count({ where: { tenantId } }),
    prisma.contrat.count({ where: { tenantId, statut: 'ACTIF' } }),
    prisma.contrat.count({ where: { tenantId, createdAt: { gte: startThisMonth, lte: endThisMonth } } }),
    prisma.contrat.count({ where: { tenantId, createdAt: { gte: startLastMonth, lte: endLastMonth } } }),

    prisma.prospect.count({ where: { tenantId } }),
    prisma.prospect.count({ where: { tenantId, statut: 'CONVERTI', updatedAt: { gte: startThisMonth } } }),
    prisma.prospect.count({ where: { tenantId, createdAt: { gte: startThisMonth } } }),

    prisma.sinistre.count({ where: { tenantId, statut: { notIn: ['INDEMNISE', 'REJETE', 'CLOS'] } } }),
    prisma.sinistre.count({ where: { tenantId, createdAt: { gte: startThisMonth } } }),

    prisma.contrat.aggregate({
      where: { tenantId, createdAt: { gte: startThisMonth, lte: endThisMonth } },
      _sum: { primeAnnuelle: true },
    }),
    prisma.contrat.aggregate({
      where: { tenantId, createdAt: { gte: startLastMonth, lte: endLastMonth } },
      _sum: { primeAnnuelle: true },
    }),

    prisma.contrat.count({
      where: {
        tenantId, statut: 'ACTIF',
        dateEcheance: { gte: now, lte: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) },
      },
    }),

    prisma.agent.count({ where: { tenantId, isActif: true } }),
  ])

  const caThisMth = primesThisMth._sum.primeAnnuelle ?? 0
  const caLastMth = primesLastMth._sum.primeAnnuelle ?? 0
  const caTrend = caLastMth > 0 ? ((caThisMth - caLastMth) / caLastMth) * 100 : 0

  const tauxConversion = prospectsThisMth > 0
    ? Math.round((prospectsConvertisMth / prospectsThisMth) * 100)
    : 0

  const contratsTrend = contratsLastMth > 0
    ? ((contratsThisMth - contratsLastMth) / contratsLastMth) * 100
    : 0

  const [parProduit, evolutionCA] = await Promise.all([
    prisma.contrat.groupBy({
      by: ['typeProduit'],
      where: { tenantId },
      _count: true,
      orderBy: { _count: { typeProduit: 'desc' } },
    }),
    Promise.all(
      Array.from({ length: 6 }, (_, i) => {
        const mois = subMonths(now, 5 - i)
        return prisma.contrat.aggregate({
          where: { tenantId, createdAt: { gte: startOfMonth(mois), lte: endOfMonth(mois) } },
          _sum: { primeAnnuelle: true },
        }).then((r) => ({
          mois: mois.toLocaleDateString('fr-CM', { month: 'short', year: '2-digit' }),
          ca: r._sum.primeAnnuelle ?? 0,
        }))
      })
    ),
  ])

  return NextResponse.json({
    contratsActifs,
    totalContrats,
    contratsTrend: Math.round(contratsTrend),
    contratsThisMth,
    caThisMth,
    caLastMth,
    caTrend: Math.round(caTrend),
    totalProspects,
    tauxConversion,
    sinistresOuverts,
    sinistresThisMth,
    echeances30j,
    agentsActifs,
    parProduit,
    evolutionCA,
  })
}

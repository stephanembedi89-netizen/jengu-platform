import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { startOfMonth } from 'date-fns'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const debutMois = startOfMonth(new Date())

  const [agents, commissionsAgg] = await Promise.all([
    prisma.agent.findMany({
      where: { tenantId: session.tenantId },
      include: { _count: { select: { contrats: true, prospects: true } } },
      orderBy: { nom: 'asc' },
    }),
    prisma.contrat.groupBy({
      by: ['agentId'],
      where: { tenantId: session.tenantId, createdAt: { gte: debutMois } },
      _sum: { primeAnnuelle: true, commission: true },
    }),
  ])

  const commMap = new Map(commissionsAgg.map((c) => [c.agentId, c._sum]))

  const agentsWithCA = agents.map((agent) => ({
    ...agent,
    caThisMth: commMap.get(agent.id)?.primeAnnuelle ?? 0,
    commissionThisMth: commMap.get(agent.id)?.commission ?? 0,
  }))

  return NextResponse.json(agentsWithCA)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || !['ADMIN', 'SUPERVISEUR'].includes(session.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  const body = await req.json()
  const { nom, prenom, telephone, zone, objectifMensuel, tauxCommission, email } = body

  if (!nom || !telephone) {
    return NextResponse.json({ error: 'Nom et téléphone requis' }, { status: 400 })
  }

  const existing = await prisma.agent.findUnique({ where: { tenantId_telephone: { tenantId: session.tenantId, telephone } } })
  if (existing) return NextResponse.json({ error: 'Un agent avec ce numéro existe déjà' }, { status: 409 })

  const agent = await prisma.agent.create({
    data: {
      tenantId: session.tenantId,
      nom: nom.trim(),
      prenom: prenom?.trim() ?? '',
      telephone: telephone.trim(),
      email: email?.trim().toLowerCase(),
      zone: zone?.trim(),
      objectifMensuel: objectifMensuel ? Number(objectifMensuel) : null,
      tauxCommission: tauxCommission ? Number(tauxCommission) : 10,
      isActif: true,
    },
  })

  return NextResponse.json(agent, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { genNumero } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const statut = searchParams.get('statut')
  const search = searchParams.get('search')
  const filter = searchParams.get('filter')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const now = new Date()
  const where: Record<string, unknown> = { tenantId: session.tenantId }
  if (statut) where.statut = statut
  if (filter === 'echeances') {
    where.statut = 'ACTIF'
    where.dateEcheance = { gte: now, lte: new Date(now.getTime() + 30 * 86400000) }
  }
  if (search) {
    where.OR = [
      { numero: { contains: search } },
      { nomAssure: { contains: search, mode: 'insensitive' } },
      { telephoneAssure: { contains: search } },
    ]
  }
  if (session.role === 'AGENT') {
    const agent = await prisma.agent.findFirst({ where: { tenantId: session.tenantId, user: { id: session.userId } } })
    if (agent) where.agentId = agent.id
  }

  const [contrats, total] = await Promise.all([
    prisma.contrat.findMany({
      where,
      include: {
        agent: { select: { nom: true, prenom: true } },
        produit: { select: { nom: true } },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.contrat.count({ where }),
  ])

  return NextResponse.json({ contrats, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { nomAssure, prenomAssure, telephoneAssure, emailAssure, agentId, typeProduit, primeAnnuelle, dateEffet, dateEcheance, renouvAuto, notes } = body

  if (!nomAssure || !telephoneAssure || !agentId || !typeProduit || !primeAnnuelle || !dateEffet || !dateEcheance) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const count = await prisma.contrat.count({ where: { tenantId: session.tenantId } })
  const numero = genNumero('POL', count + 1)

  const tauxCommission = (await prisma.agent.findUnique({ where: { id: agentId }, select: { tauxCommission: true } }))?.tauxCommission ?? 10
  const primeNette = Number(primeAnnuelle)
  const commission = primeNette * (tauxCommission / 100)

  const contrat = await prisma.contrat.create({
    data: {
      tenantId: session.tenantId,
      agentId,
      nomAssure: nomAssure.trim(),
      prenomAssure: prenomAssure?.trim(),
      telephoneAssure: telephoneAssure.trim(),
      emailAssure: emailAssure?.trim().toLowerCase(),
      numero,
      typeProduit,
      primeAnnuelle: primeNette,
      primeNette,
      commission,
      statut: 'ACTIF',
      dateEffet: new Date(dateEffet),
      dateEcheance: new Date(dateEcheance),
      renouvAuto: renouvAuto ?? true,
      notes: notes?.trim(),
    },
  })

  await prisma.activite.create({
    data: {
      tenantId: session.tenantId,
      agentId,
      type: 'CONTRAT_SIGNE',
      description: `Nouveau contrat ${numero} — ${nomAssure}`,
      contratId: contrat.id,
    },
  })

  return NextResponse.json(contrat, { status: 201 })
}

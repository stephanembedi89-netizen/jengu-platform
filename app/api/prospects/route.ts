import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const statut = searchParams.get('statut')
  const agentId = searchParams.get('agentId')
  const search = searchParams.get('search')
  const page = Number(searchParams.get('page') ?? 1)
  const limit = 20

  const where: Record<string, unknown> = { tenantId: session.tenantId }
  if (statut) where.statut = statut
  if (agentId) where.agentId = agentId
  if (session.role === 'AGENT') {
    const agent = await prisma.agent.findFirst({ where: { tenantId: session.tenantId, user: { id: session.userId } } })
    if (agent) where.agentId = agent.id
  }
  if (search) {
    where.OR = [
      { nom: { contains: search, mode: 'insensitive' } },
      { prenom: { contains: search, mode: 'insensitive' } },
      { telephone: { contains: search } },
    ]
  }

  const [prospects, total] = await Promise.all([
    prisma.prospect.findMany({
      where,
      include: { agent: { select: { nom: true, prenom: true } } },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.prospect.count({ where }),
  ])

  return NextResponse.json({ prospects, total, pages: Math.ceil(total / limit) })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { nom, prenom, telephone, agentId, typePersonne, raisonSociale, email, adresse, arrondissement, quartier, profession, produitInteret, noteInterne } = body

  if (!nom || !telephone || !agentId) {
    return NextResponse.json({ error: 'Nom, téléphone et agent requis' }, { status: 400 })
  }

  const prospect = await prisma.prospect.create({
    data: {
      tenantId: session.tenantId,
      agentId,
      nom: nom.trim(),
      prenom: prenom?.trim(),
      telephone: telephone.trim(),
      typePersonne: typePersonne ?? 'PHYSIQUE',
      raisonSociale: raisonSociale?.trim(),
      email: email?.trim().toLowerCase(),
      adresse: adresse?.trim(),
      arrondissement,
      quartier: quartier?.trim(),
      profession: profession?.trim(),
      produitInteret,
      noteInterne: noteInterne?.trim(),
      statut: 'NOUVEAU',
    },
  })

  await prisma.activite.create({
    data: {
      tenantId: session.tenantId,
      agentId,
      type: 'NOTE',
      description: `Nouveau prospect ajouté: ${nom} ${prenom ?? ''}`,
      prospectId: prospect.id,
    },
  })

  return NextResponse.json(prospect, { status: 201 })
}

import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { genNumero } from '@/lib/utils'

export async function GET(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const statut = searchParams.get('statut')

  const where: Record<string, unknown> = { tenantId: session.tenantId }
  if (statut) where.statut = statut

  const sinistres = await prisma.sinistre.findMany({
    where,
    include: {
      contrat: { select: { numero: true, nomAssure: true, typeProduit: true } },
      agent: { select: { nom: true, prenom: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return NextResponse.json(sinistres)
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const { contratId, agentId, dateSinistre, lieuSinistre, description, gravite, montantDeclare } = body

  if (!contratId || !agentId || !dateSinistre || !description) {
    return NextResponse.json({ error: 'Champs obligatoires manquants' }, { status: 400 })
  }

  const contrat = await prisma.contrat.findFirst({ where: { id: contratId, tenantId: session.tenantId } })
  if (!contrat) return NextResponse.json({ error: 'Contrat introuvable' }, { status: 404 })

  const count = await prisma.sinistre.count({ where: { tenantId: session.tenantId } })
  const numero = genNumero('SIN', count + 1)

  const sinistre = await prisma.sinistre.create({
    data: {
      tenantId: session.tenantId,
      contratId,
      agentId,
      numero,
      dateSinistre: new Date(dateSinistre),
      lieuSinistre: lieuSinistre?.trim(),
      description: description.trim(),
      gravite: gravite ?? 'MOYEN',
      statut: 'DECLARE',
      montantDeclare: montantDeclare ? Number(montantDeclare) : null,
    },
  })

  await prisma.activite.create({
    data: {
      tenantId: session.tenantId,
      agentId,
      type: 'SINISTRE_DECLARE',
      description: `Sinistre ${numero} déclaré — contrat ${contrat.numero}`,
      contratId,
      sinistreId: sinistre.id,
    },
  })

  return NextResponse.json(sinistre, { status: 201 })
}

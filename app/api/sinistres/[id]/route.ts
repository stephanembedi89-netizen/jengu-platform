import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const sinistre = await prisma.sinistre.findFirst({ where: { id: params.id, tenantId: session.tenantId } })
  if (!sinistre) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const updated = await prisma.sinistre.update({ where: { id: params.id }, data: { ...body, updatedAt: new Date() } })

  if (body.statut && body.statut !== sinistre.statut) {
    await prisma.activite.create({
      data: {
        tenantId: session.tenantId,
        type: 'NOTE',
        description: `Sinistre ${sinistre.numero}: ${sinistre.statut} → ${body.statut}`,
        sinistreId: sinistre.id,
        contratId: sinistre.contratId,
      },
    })
  }

  return NextResponse.json(updated)
}

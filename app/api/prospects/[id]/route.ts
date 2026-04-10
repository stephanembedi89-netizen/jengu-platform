import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const body = await req.json()
  const prospect = await prisma.prospect.findFirst({
    where: { id: params.id, tenantId: session.tenantId },
  })
  if (!prospect) return NextResponse.json({ error: 'Introuvable' }, { status: 404 })

  const updated = await prisma.prospect.update({
    where: { id: params.id },
    data: { ...body, updatedAt: new Date() },
  })

  if (body.statut && body.statut !== prospect.statut) {
    await prisma.activite.create({
      data: {
        tenantId: session.tenantId,
        type: 'NOTE',
        description: `Statut prospect mis à jour: ${prospect.statut} → ${body.statut}`,
        prospectId: prospect.id,
      },
    })
  }

  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getSession()
  if (!session || !['ADMIN', 'SUPERVISEUR'].includes(session.role)) {
    return NextResponse.json({ error: 'Accès refusé' }, { status: 403 })
  }

  await prisma.prospect.delete({ where: { id: params.id, tenantId: session.tenantId } })
  return NextResponse.json({ ok: true })
}

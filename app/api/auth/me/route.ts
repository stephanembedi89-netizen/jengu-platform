import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, nom: true, prenom: true, email: true, role: true, avatarUrl: true,
      tenant: { select: { id: true, nom: true, plan: true, trialEndsAt: true, isActive: true } } },
  })

  if (!user) return NextResponse.json({ error: 'Utilisateur introuvable' }, { status: 404 })
  return NextResponse.json(user)
}

import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 })
    }

    const user = await prisma.user.findFirst({
      where: { email: email.toLowerCase().trim(), isActive: true },
      include: { tenant: true },
    })

    if (!user || !await bcrypt.compare(password, user.passwordHash)) {
      return NextResponse.json({ error: 'Email ou mot de passe incorrect' }, { status: 401 })
    }

    if (!user.tenant.isActive) {
      return NextResponse.json({ error: 'Compte suspendu. Contactez le support.' }, { status: 403 })
    }

    const token = await createToken({
      userId: user.id,
      tenantId: user.tenantId,
      role: user.role,
      email: user.email,
    })

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, role: user.role, tenantId: user.tenantId },
    })

    res.cookies.set('jengu_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    })

    return res
  } catch (err) {
    console.error('[LOGIN]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

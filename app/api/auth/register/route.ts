import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { createToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { nomSociete, typeStructure, arrondissement, email, telephone, nom, prenom, password } = await req.json()

    if (!nomSociete || !email || !password || !nom || !prenom || !telephone) {
      return NextResponse.json({ error: 'Tous les champs obligatoires doivent être remplis' }, { status: 400 })
    }
    if (password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit faire au moins 8 caractères' }, { status: 400 })
    }

    const existing = await prisma.tenant.findUnique({ where: { email: email.toLowerCase().trim() } })
    if (existing) {
      return NextResponse.json({ error: 'Un compte existe déjà avec cet email' }, { status: 409 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const trialEnd = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 jours

    const tenant = await prisma.tenant.create({
      data: {
        nom: nomSociete.trim(),
        typeStructure: typeStructure ?? 'COURTIER',
        arrondissement: arrondissement ?? 'Douala I (Wouri)',
        email: email.toLowerCase().trim(),
        telephone: telephone.trim(),
        plan: 'STARTER',
        trialEndsAt: trialEnd,
        isActive: true,
        users: {
          create: {
            email: email.toLowerCase().trim(),
            passwordHash,
            nom: nom.trim(),
            prenom: prenom.trim(),
            role: 'ADMIN',
            isActive: true,
          },
        },
      },
      include: { users: true },
    })

    const user = tenant.users[0]
    const token = await createToken({
      userId: user.id,
      tenantId: tenant.id,
      role: user.role,
      email: user.email,
    })

    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, nom: user.nom, prenom: user.prenom, role: user.role },
    }, { status: 201 })

    res.cookies.set('jengu_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error('[REGISTER]', err)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { prisma } from './prisma'

const SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? 'jengu-assur-secret-key-change-in-production'
)

export interface SessionPayload {
  userId: string
  tenantId: string
  role: string
  email: string
}

export async function createToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(SECRET)
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET)
    return payload as unknown as SessionPayload
  } catch {
    return null
  }
}

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('jengu_session')?.value
  if (!token) return null
  return verifyToken(token)
}

export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession()
  if (!session) throw new Error('Non authentifié')
  return session
}

export async function requireRole(roles: string[]) {
  const session = await requireSession()
  if (!roles.includes(session.role)) throw new Error('Accès refusé')
  return session
}

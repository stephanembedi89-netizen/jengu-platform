import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession()
  if (!session) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      id: true, nom: true, prenom: true, email: true, role: true, avatarUrl: true,
      tenant: { select: { id: true, nom: true, plan: true, trialEndsAt: true, isActive: true } },
    },
  })

  if (!user || !user.tenant.isActive) redirect('/login')

  const trialDaysLeft = user.tenant.trialEndsAt
    ? Math.ceil((new Date(user.tenant.trialEndsAt).getTime() - Date.now()) / 86400000)
    : null

  return (
    <div className="min-h-screen bg-[#0a0f1e] flex">
      <Sidebar role={user.role} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar user={user} trialDaysLeft={trialDaysLeft} />
        <main className="flex-1 p-4 md:p-6 overflow-auto animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  )
}

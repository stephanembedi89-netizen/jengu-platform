'use client'

import { Bell, AlertCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface TopbarProps {
  user: { nom: string; prenom: string; role: string; tenant: { nom: string; plan: string } }
  trialDaysLeft: number | null
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'Administrateur',
  SUPERVISEUR: 'Superviseur',
  AGENT: 'Agent commercial',
  SUPER_ADMIN: 'Super Admin',
}

const PLAN_COLORS: Record<string, string> = {
  STARTER: 'badge-muted',
  PRO: 'badge-blue',
  ENTERPRISE: 'badge bg-purple-500/15 text-purple-400 border border-purple-500/30',
}

export default function Topbar({ user, trialDaysLeft }: TopbarProps) {
  const today = formatDate(new Date())

  return (
    <header className="h-14 bg-[#0d1424] border-b border-[#1f2937] flex items-center justify-between px-4 md:px-6 shrink-0">
      <div>
        <p className="text-xs text-gray-500">{today}</p>
        <p className="text-sm font-medium text-gray-200 hidden md:block">{user.tenant.nom}</p>
      </div>

      <div className="flex items-center gap-3">
        {/* Trial warning */}
        {trialDaysLeft !== null && trialDaysLeft <= 14 && trialDaysLeft > 0 && (
          <div className="hidden md:flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-1.5 text-xs text-amber-400">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            Essai : {trialDaysLeft}j restants
          </div>
        )}

        {/* Plan badge */}
        <span className={PLAN_COLORS[user.tenant.plan] ?? 'badge-muted'}>
          {user.tenant.plan}
        </span>

        {/* Notifications */}
        <button className="relative text-gray-500 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-[#1a2235]">
          <Bell className="w-4 h-4" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
            {user.prenom.charAt(0)}{user.nom.charAt(0)}
          </div>
          <div className="hidden md:block">
            <p className="text-xs font-medium text-white">{user.prenom} {user.nom}</p>
            <p className="text-xs text-gray-500">{ROLE_LABELS[user.role]}</p>
          </div>
        </div>
      </div>
    </header>
  )
}

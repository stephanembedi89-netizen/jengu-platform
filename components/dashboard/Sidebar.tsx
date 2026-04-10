'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Users, FileText, Shield, AlertTriangle,
  Settings, TrendingUp, LogOut, ChevronLeft, Menu, Sparkles
} from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/dashboard',    label: 'Tableau de bord', icon: LayoutDashboard, roles: ['ADMIN','SUPERVISEUR','AGENT'] },
  { href: '/prospects',    label: 'Prospects',        icon: TrendingUp,      roles: ['ADMIN','SUPERVISEUR','AGENT'] },
  { href: '/contrats',     label: 'Contrats',         icon: FileText,        roles: ['ADMIN','SUPERVISEUR','AGENT'] },
  { href: '/sinistres',    label: 'Sinistres',        icon: AlertTriangle,   roles: ['ADMIN','SUPERVISEUR','AGENT'] },
  { href: '/agents',       label: 'Agents',           icon: Users,           roles: ['ADMIN','SUPERVISEUR'] },
  { href: '/assistant',    label: 'AgentPulse AI',    icon: Sparkles,        roles: ['ADMIN','SUPERVISEUR','AGENT'] },
  { href: '/parametres',   label: 'Paramètres',       icon: Settings,        roles: ['ADMIN'] },
]

async function handleLogout() {
  await fetch('/api/auth/logout', { method: 'POST' })
  window.location.href = '/login'
}

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const filtered = NAV_ITEMS.filter((item) => item.roles.includes(role))

  return (
    <>
      {/* Mobile overlay */}
      <div className={cn('fixed inset-0 bg-black/50 z-20 md:hidden', collapsed ? 'hidden' : 'block')}
        onClick={() => setCollapsed(true)} />

      <aside className={cn(
        'fixed md:sticky top-0 h-screen flex flex-col bg-[#0d1424] border-r border-[#1f2937] z-30 transition-all duration-300',
        collapsed ? 'w-16' : 'w-56'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-[#1f2937] shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Shield className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold text-sm">Agent<span className="text-blue-400">Pulse</span></span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-[#1a2235] ml-auto"
          >
            {collapsed ? <Menu className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
          {filtered.map((item) => {
            const active = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
            return (
              <Link key={item.href} href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                  active
                    ? 'bg-blue-600/15 text-blue-400 border-l-2 border-blue-500 pl-2.5'
                    : 'text-gray-400 hover:bg-[#1a2235] hover:text-white',
                  collapsed && 'justify-center'
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="w-4 h-4 shrink-0" />
                {!collapsed && item.label}
              </Link>
            )
          })}
        </nav>

        {/* Logout */}
        <div className="p-2 border-t border-[#1f2937] shrink-0">
          <button
            onClick={handleLogout}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors w-full',
              collapsed && 'justify-center'
            )}
            title={collapsed ? 'Déconnexion' : undefined}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!collapsed && 'Déconnexion'}
          </button>
        </div>
      </aside>
    </>
  )
}

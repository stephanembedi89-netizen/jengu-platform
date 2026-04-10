'use client'

import { formatXAF, formatDate, STATUT_PROSPECT_LABELS, TYPE_ACTIVITE_ICONS } from '@/lib/utils'
import { TrendingUp, FileText, AlertTriangle, Bell, Users, Activity } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import Link from 'next/link'

const STATUT_COLORS: Record<string, string> = {
  NOUVEAU: '#6b7280',
  CONTACTE: '#3b82f6',
  INTERESSE: '#8b5cf6',
  DEVIS_ENVOYE: '#f59e0b',
  RELANCE: '#f97316',
  CONVERTI: '#10b981',
  PERDU: '#ef4444',
}

const PIE_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4', '#f97316']

interface Props {
  stats: { contratsActifs: number; totalProspects: number; sinistresOuverts: number; echeances30j: number; caThisMth: number }
  activites: Array<{ id: string; type: string; description: string; createdAt: Date; agent: { nom: string; prenom: string } | null; prospect: { nom: string; prenom: string } | null }>
  topAgents: Array<{ id: string; nom: string; prenom: string; zone: string | null; _count: { contrats: number; prospects: number } }>
  prospectsParStatut: Array<{ statut: string; _count: number }>
  role: string
}

const STAT_CARDS = (stats: Props['stats']) => [
  {
    label: 'Contrats actifs',
    value: stats.contratsActifs,
    icon: FileText,
    color: 'text-blue-400',
    border: 'border-l-blue-500',
    href: '/contrats',
  },
  {
    label: 'CA ce mois',
    value: formatXAF(stats.caThisMth),
    icon: TrendingUp,
    color: 'text-emerald-400',
    border: 'border-l-emerald-500',
    href: '/contrats',
  },
  {
    label: 'Prospects pipeline',
    value: stats.totalProspects,
    icon: Users,
    color: 'text-amber-400',
    border: 'border-l-amber-500',
    href: '/prospects',
  },
  {
    label: 'Sinistres ouverts',
    value: stats.sinistresOuverts,
    icon: AlertTriangle,
    color: 'text-red-400',
    border: 'border-l-red-500',
    href: '/sinistres',
  },
]

export default function DashboardClient({ stats, activites, topAgents, prospectsParStatut, role }: Props) {
  const statCards = STAT_CARDS(stats)

  const pieData = prospectsParStatut.map((p) => ({
    name: STATUT_PROSPECT_LABELS[p.statut] ?? p.statut,
    value: p._count,
    color: STATUT_COLORS[p.statut] ?? '#6b7280',
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Tableau de bord</h1>
          <p className="text-sm text-gray-400">Vue d'ensemble de votre activité commerciale</p>
        </div>
        {stats.echeances30j > 0 && (
          <Link href="/contrats?filter=echeances" className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2 text-sm text-amber-400 hover:bg-amber-500/20 transition-colors">
            <Bell className="w-4 h-4" />
            {stats.echeances30j} renouvellement{stats.echeances30j > 1 ? 's' : ''} à venir
          </Link>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href}
            className={`stat-card border-l-2 ${card.border} hover:border-opacity-100 transition-all`}>
            <div className="flex items-center justify-between">
              <p className="text-xs text-gray-400">{card.label}</p>
              <card.icon className={`w-4 h-4 ${card.color}`} />
            </div>
            <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
          </Link>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Pipeline prospects */}
        <div className="lg:col-span-2 card-glass p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Pipeline Prospects par statut
          </h3>
          {prospectsParStatut.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={prospectsParStatut.map((p) => ({
                name: STATUT_PROSPECT_LABELS[p.statut] ?? p.statut,
                count: p._count,
                fill: STATUT_COLORS[p.statut],
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 11 }} />
                <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#111827', border: '1px solid #1f2937', borderRadius: 8 }}
                  labelStyle={{ color: '#fff' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {prospectsParStatut.map((p, i) => (
                    <Cell key={i} fill={STATUT_COLORS[p.statut] ?? PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 text-sm">
              Aucun prospect enregistré
            </div>
          )}
        </div>

        {/* Répartition */}
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold mb-4">Répartition statuts</h3>
          {pieData.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" paddingAngle={2}>
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-1.5 mt-2">
                {pieData.slice(0, 4).map((d) => (
                  <div key={d.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                      <span className="text-gray-400">{d.name}</span>
                    </div>
                    <span className="text-white font-medium">{d.value}</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-500 text-sm">Pas de données</div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Top agents */}
        {role !== 'AGENT' && (
          <div className="card-glass p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" /> Top Agents
            </h3>
            {topAgents.length > 0 ? (
              <div className="space-y-3">
                {topAgents.map((agent, i) => (
                  <div key={agent.id} className="flex items-center gap-3">
                    <span className="w-5 text-xs text-gray-500 font-bold">{i + 1}</span>
                    <div className="w-7 h-7 rounded-full bg-blue-600/30 flex items-center justify-center text-xs font-bold text-blue-400">
                      {agent.prenom.charAt(0)}{agent.nom.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{agent.prenom} {agent.nom}</p>
                      <p className="text-xs text-gray-500">{agent.zone ?? 'Douala'}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-400">{agent._count.contrats}</p>
                      <p className="text-xs text-gray-500">contrats</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Aucun agent enregistré</p>
            )}
          </div>
        )}

        {/* Activités récentes */}
        <div className="card-glass p-5">
          <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-400" /> Activités récentes
          </h3>
          {activites.length > 0 ? (
            <div className="space-y-3">
              {activites.map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300 truncate">{a.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {a.agent ? `${a.agent.prenom} ${a.agent.nom}` : 'Système'} · {formatDate(a.createdAt)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 text-center py-4">Aucune activité récente</p>
          )}
        </div>
      </div>
    </div>
  )
}
